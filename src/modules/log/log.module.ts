import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'src/database/prisma/prisma.module';

import { AuditLogSchemaName, AuditLogSchema } from '../mongo/logs.model';
import { MongoService } from '../mongo/mongo.service';
import { LogRepository } from './log.repository';
import { LogService } from './log.service';

@Module({
  providers: [LogService, LogRepository, MongoService],
  exports: [LogService, LogRepository],
  imports: [
    PrismaModule,
    MongooseModule.forFeature([
      { name: AuditLogSchemaName, schema: AuditLogSchema },
    ]),
  ],
})
export class LogModule {}
