import mongoose from 'mongoose';

export const WebsocketSchemaName = 'Websocket';

export const WebsocketSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  email: { type: String, required: true },
  ids: { type: [String], required: true, default: [] },
});

export interface WebsocketMongo extends mongoose.Document {
  ip: string;
  email: string;
  ids: string[];
}

export const LogsModel = mongoose.model<WebsocketMongo>(
  WebsocketSchemaName,
  WebsocketSchema,
);
