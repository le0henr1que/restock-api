import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';
import { PrismaModule } from 'src/database/prisma/prisma.module';

import { EmailService } from '../email/email.service';
import { LogModule } from '../log/log.module';
import { MongoService } from '../mongo/mongo.service';
import { WebsocketSchema, WebsocketSchemaName } from '../mongo/websocket.model';
import { WebsocketModule } from '../websocket/websocket.module';
import { UserController } from './user.controller';
import { UserMapping } from './user.mapping';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    UserMapping,
    UserRepository,
    AuthRepository,
    EmailService,
    MongoService,
  ],
  imports: [
    PrismaModule,
    JwtModule,
    LogModule,
    WebsocketModule,
    MongooseModule.forFeature([
      { name: WebsocketSchemaName, schema: WebsocketSchema },
    ]),
    // StripeModule,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
