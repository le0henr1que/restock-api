import { LogActionEnum, LogStatusEnum, MethodEnum } from '@prisma/client';
import mongoose from 'mongoose';

export const AuditLogSchemaName = 'AuditLog';

export const AuditLogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  ip: { type: String, required: true },
  email: { type: String, required: true },
  url: { type: String, required: true },
  action: { type: String, required: true },
  status: { type: String, required: true },
  method: { type: String, required: true },
  information: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export interface AuditLogMongo extends mongoose.Document {
  id: number;
  ip: string;
  email: string;
  url: string;
  action: LogActionEnum;
  status: LogStatusEnum;
  method: MethodEnum;
  information: string;
  createdAt: Date;
}

export const LogsModel = mongoose.model<AuditLogMongo>(
  AuditLogSchemaName,
  AuditLogSchema,
);
