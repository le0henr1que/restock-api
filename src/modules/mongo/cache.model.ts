import mongoose from 'mongoose';

export const CacheSchemaName = 'Caches';

export const CacheSchema = new mongoose.Schema({
  key: { type: String },
  value: { type: String },
});

export interface Cache extends mongoose.Document {
  key: string;
  value: string;
}

export const CacheModel = mongoose.model<Cache>(CacheSchemaName, CacheSchema);
