import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Model, FilterQuery } from 'mongoose';
import { AuditLog } from 'src/middlewares/interface/logger';

import { AuditLogSchemaName, AuditLogMongo } from '../mongo/logs.model';
import { MongoService } from '../mongo/mongo.service';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  private _logger: LoggerService;

  constructor(
    private readonly logsRepository: LogRepository,
    private readonly mongoService: MongoService,
    @InjectModel(AuditLogSchemaName)
    private readonly mongoModel: Model<AuditLogMongo>,
  ) {
    this._logger = new Logger(LogService.name);
  }

  /**
   * Creates a new log entry.
   *
   * @param {AuditLog} data - The audit log data to be created.
   * @param {Prisma.TransactionClient} [transaction] - Optional transaction client for the operation.
   * @returns {Promise<AuditLog>} A promise that resolves to the created audit log entry.
   * @description This method creates a new audit log entry using the provided audit log data.
   *              If a transaction client is provided, it uses that transaction for the database operation.
   */
  async createAuditLog(
    data: AuditLog,
    optionals?: {
      transaction?: Prisma.TransactionClient;
      identifierRequest?: string;
    },
  ): Promise<AuditLog> {
    const identifierRequest = optionals?.identifierRequest ?? randomUUID();

    this._logger.debug(
      `${identifierRequest} Creating audit log ${data.action}`,
    );

    return await this.logsRepository.createAuditLog(
      data,
      optionals?.transaction,
    );
  }

  /**
   * Retrieves all log entries.
   *
   * @param {Prisma.TransactionClient} [transaction] - Optional transaction client for the operation.
   * @returns {Promise<AuditLog[]>} A promise that resolves to an array of audit log entries.
   * @description This method retrieves all audit log entries from the database.
   *              It returns an array of audit log entries.
   */
  async getAuditLogs(optionals?: {
    transaction?: Prisma.TransactionClient;
    identifierRequest?: string;
  }): Promise<AuditLog[]> {
    const identifierRequest = optionals?.identifierRequest ?? randomUUID();
    this._logger.debug(
      `${identifierRequest} Getting all audit logs from database`,
    );
    return await this.logsRepository.getAuditLogs(optionals?.transaction);
  }

  /**
   * Cleans or deletes all log entries.
   *
   * @param {Prisma.TransactionClient} [transaction] - Optional transaction client for the operation.
   * @returns {Promise<void>} A promise that resolves when the audit logs have been cleaned.
   * @description This method is used to clean or delete all audit log entries from the database.
   *              It can be used for maintenance or to manage the size of the audit log data.
   */
  async cleanAuditLogs(optionals?: {
    transaction?: Prisma.TransactionClient;
    identifierRequest?: string;
  }): Promise<void> {
    const identifierRequest = optionals?.identifierRequest ?? randomUUID();
    this._logger.debug(
      `${identifierRequest} Cleaning audit logs from database`,
    );
    await this.logsRepository.cleanAuditLogs(optionals?.transaction);
  }

  /**
   * Creates log entries in the MongoDB database.
   *
   * @param {AuditLog[]} data - An array of log data to be created in MongoDB.
   * @returns {Promise<void>} A promise that resolves when the log entries have been successfully created.
   * @description This method creates multiple log entries in the MongoDB database.
   *              It takes an array of log data and saves each entry to the database.
   */
  async createLogCache(
    data: AuditLog[],
    optionals: {
      identifierRequest?: string;
    },
  ): Promise<void> {
    const identifierRequest = optionals?.identifierRequest ?? randomUUID();
    this._logger.debug(
      `${identifierRequest} Creating audit logs in mongo database`,
    );

    await this.mongoService.create<AuditLogMongo>(data, this.mongoModel);
  }

  /**
   *
   * @param filter
   * Optional filter to get audit logs from mongo database
   *
   * example: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
   * @returns AuditLog[]
   */
  async getLogCache(optionals?: {
    filter?: FilterQuery<AuditLog>;
    identifierRequest?: string;
  }): Promise<AuditLog[]> {
    const identifierRequest = optionals?.identifierRequest ?? randomUUID();
    this._logger.debug(
      `${identifierRequest} Getting audit logs from mongo database`,
    );

    return await this.mongoService.findAll<AuditLogMongo>(
      this.mongoModel,
      optionals?.filter,
    );
  }
}
