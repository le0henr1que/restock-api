import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { LogActionEnum, LogStatusEnum, MethodEnum } from '@prisma/client';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { UserPayload } from 'src/auth/models/UserPayload';
import {
  setMessage,
  getMessage,
  MessagesHelperKey,
} from 'src/helpers/messages.helper';
import { AuditLog } from 'src/middlewares/interface/logger';
import { enabledMultipleLogin } from 'src/utils/environment';
import { validateToken } from 'src/utils/token';

import { LogService } from '../log/log.service';
import { MongoService } from '../mongo/mongo.service';
import { WebsocketMongo, WebsocketSchemaName } from '../mongo/websocket.model';
import { WebsocketRepository } from './websocket.repository';

export let countLoggedUsers = 0;

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      callback(null, origin);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
  allowEIO3: true,
})
export class WebsocketService
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private readonly logger = new Logger(WebsocketService.name);
  private readonly WEBSOCKET_URL = '/websocket';

  constructor(
    private logService: LogService,
    private mongoService: MongoService,
    @InjectModel(WebsocketSchemaName)
    private readonly mongoModel: Model<WebsocketMongo>,
    private websocketRepository: WebsocketRepository,
  ) {}

  @WebSocketServer() server: Server;

  /**
   * Handles a new WebSocket connection.
   *
   * @param {Socket} client - The connected WebSocket client.
   *
   * @description
   * This method is triggered when a new client connects to the WebSocket server.
   * It validates the client's request identification and email. If invalid, the client is disconnected.
   * It also handles multiple login scenarios based on the email and IP address, logging the activity.
   */
  async handleConnection(client: Socket) {
    const functionName = 'Websocket HandleConnection';

    const identification: string = client.handshake.query.ip as string;
    const token: string = (client.handshake.headers['authorization'] ||
      client.handshake.headers['Authorization']) as string;

    const tokenDecrypted = await validateToken(token);

    const fullyValidated = this.connectGuard(
      client,
      tokenDecrypted,
      identification,
    );

    if (!fullyValidated) {
      client.disconnect();
      return;
    }

    const email = tokenDecrypted.user.email;

    this.logger.debug(
      `Client ID: ${client.id} - Email: ${email} - Identification: ${identification}`,
    );

    const websocketData: WebsocketMongo = await this.mongoService.findOne(
      { email },
      this.mongoModel,
    );

    if (!websocketData) {
      await this.mongoService.create(
        {
          email,
          ip: identification,
          ids: [client.id],
        },
        this.mongoModel,
      );
    } else {
      if (
        websocketData.ids.length > 0 &&
        websocketData.ip !== identification &&
        !enabledMultipleLogin()
      ) {
        this.emitLogout(websocketData.ids);

        const user = await this.websocketRepository.getByEmail(email);

        if (user) {
          await this.logService.createAuditLog(
            new AuditLog(
              functionName,
              identification,
              this.WEBSOCKET_URL,
              MethodEnum['POST'],
              user.email,
              LogStatusEnum.ERROR,
              LogActionEnum.MULTIPLE_LOGIN,
              setMessage(
                getMessage(MessagesHelperKey.MULTIPLE_LOGIN_ERROR, 'pt-BR'),
                user.email,
              ),
            ),
          );
        }
      }

      await this.mongoService.upsert(
        { email },
        { $set: { ip: identification }, $addToSet: { ids: client.id } },
        this.mongoModel,
      );
    }

    countLoggedUsers = this.server.engine.clientsCount;
    this.logger.debug(`Client connected: ${client.id}`);
  }

  /**
   * Validates a client's connection using a decrypted token and identification string.
   * If the token is invalid, the user email is missing, or the identification is undefined, null, or empty,
   * the client is disconnected.
   *
   * @param {Socket} client - The client socket attempting to connect.
   * @param {object} tokenDecrypted - An object containing the validation result of the token and, optionally, the user payload.
   * @param {string} identification - A string used for additional client identification.
   */
  connectGuard(
    client: Socket,
    tokenDecrypted: {
      tokenIsValid: boolean;
      user?: UserPayload;
    },
    identification: string,
  ) {
    if (tokenDecrypted.tokenIsValid == false) {
      this.logger.debug(`Client ID: ${client.id} - Token not valid`);
      return false;
    }

    if (!tokenDecrypted?.user?.email) {
      this.logger.debug(`Client ID: ${client.id} - Email not found`);
      return false;
    }

    if (
      identification == 'undefined' ||
      identification == null ||
      identification == ''
    ) {
      this.logger.debug(`Client ID: ${client.id} - Identification not found`);
      return false;
    }

    return true;
  }

  /**
   * Handles WebSocket client disconnection.
   *
   * @param {Socket} client - The disconnected WebSocket client.
   *
   * @description
   * This method is triggered when a client disconnects from the WebSocket server.
   * It removes the client from the list of connected users and logs the disconnection.
   * If it was the last user with a specific email, it also removes the stored IP address.
   */
  async handleDisconnect(client: Socket) {
    const email = await this.getEmailFromClient(client);

    if (!email) {
      client.disconnect();
      return;
    }

    this.logger.debug(`Client ID: ${client.id} - Email: ${email}`);

    const websocketData: WebsocketMongo = await this.mongoService.findOne(
      { email },
      this.mongoModel,
    );

    if (websocketData) {
      const index = websocketData.ids.indexOf(client.id);
      if (index !== -1) {
        websocketData.ids.splice(index, 1);

        await this.mongoService.upsert(
          { email },
          { $set: { ids: websocketData.ids } },
          this.mongoModel,
        );

        if (websocketData.ids.length === 0) {
          await this.mongoService.deleteOne({ email }, this.mongoModel);
        }
      }
    }

    countLoggedUsers = this.server.engine.clientsCount;
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  /**
   * Retrieves the email associated with a WebSocket client.
   *
   * @param {Socket} client - The WebSocket client.
   * @returns {Promise<string | undefined>} The email associated with the client, or undefined if not found.
   *
   * @description
   * This private method extracts the email of a client from the list of connected users.
   * It is used internally for managing the user connections.
   */
  private async getEmailFromClient(
    client: Socket,
  ): Promise<string | undefined> {
    const users: WebsocketMongo[] = await this.mongoService.findAll(
      this.mongoModel,
      {
        ids: client.id,
      },
    );

    if (users.length > 0) {
      return users[0].email;
    }

    return undefined;
  }

  /**
   * Emits a logout event to specified client IDs.
   *
   * @param {string[]} ids - Array of client IDs to emit the logout event to.
   *
   * @description
   * This private method emits a logout event to a list of WebSocket client IDs.
   * It is used to notify clients when they should log out, for instance in multiple login scenarios.
   */
  private emitLogout(ids: string[]) {
    ids.forEach((id) => {
      this.server.to(id).emit('logout', true);
      this.logger.debug(`Emitting Logout ID -> ${id}`);
    });
  }

  /**
   * Handles the disconnection of a blocked user based on their email address.
   *
   * @public
   * @async
   * @param {string | string[]} userEmail - The email address or an array of email addresses of the blocked users.
   * @returns {Promise<void>} - A Promise that resolves after handling the disconnection of blocked users.
   */
  public async handleDisconnectUserBlocked(
    userEmail: string | string[],
  ): Promise<void> {
    const isArray = Array.isArray(userEmail);

    if (isArray) {
      for (const email of userEmail) {
        this.handleDisconnectUserBlocked(email);
      }
      return;
    }

    const websocketData: WebsocketMongo = await this.mongoService.findOne(
      { email: userEmail },
      this.mongoModel,
    );

    if (websocketData && websocketData.ids.length > 0) {
      this.emitBlocked(websocketData.ids);

      await this.mongoService.upsert(
        { email: userEmail },
        { $set: { ids: [] } },
        this.mongoModel,
      );
    }
  }

  /**
   * Emits a 'block' event to the specified client IDs.
   *
   * @private
   * @param {string[]} ids - An array of client IDs to emit the 'block' event to.
   * @returns {void}
   * @fires Server#blocked
   */
  private emitBlocked(ids: string[]): void {
    ids.forEach((id) => {
      this.server.to(id).emit('block', true);
      this.logger.debug(`Emitting Blocked to ID -> ${id}`);
    });
  }

  /**
   * Initializes the WebSocket server.
   * @returns {void}
   * @description
   * This method is triggered when the application starts.
   * It initializes the WebSocket server and clears the MongoDB database.
   */
  onModuleInit(): void {
    this.logger.log(`Starting websocket server`);
    this.mongoService.deleteMany({}, this.mongoModel);
  }
}
