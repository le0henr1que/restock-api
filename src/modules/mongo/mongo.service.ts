import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  Document,
  UpdateWithAggregationPipeline,
  UpdateQuery,
  FilterQuery,
} from 'mongoose';

@Injectable()
export class MongoService {
  static logger: LoggerService = new Logger(MongoService.name);

  constructor() {}

  /**
   * Finds a single document matching the specified filter.
   *
   * @template M - The document type extending Mongoose's Document.
   * @param {FilterQuery<M>} filter - The filter query to find the document.
   * @param {Model<M>} mongoModel - The Mongoose model representing the document type.
   * @returns {Promise<M>} A promise that resolves to the found document, or null if not found.
   * @description This method searches for a single document in the MongoDB database that matches
   *              the provided filter query using the specified Mongoose model.
   */
  async findOne<M extends Document>(
    filter: FilterQuery<M>,
    mongoModel: Model<M>,
  ): Promise<M> {
    return await mongoModel.findOne(filter);
  }

  /**
   * Finds all documents matching the specified filter.
   *
   * @template M - The document type extending Mongoose's Document.
   * @param {FilterQuery<M>} filter - The filter query to find documents.
   * @param {Model<M>} mongoModel - The Mongoose model representing the document type.
   * @returns {Promise<M[]>} A promise that resolves to an array of found documents.
   * @description This method retrieves all documents from the MongoDB database that match
   *              the provided filter query using the specified Mongoose model.
   */
  async findAll<M extends Document>(
    mongoModel: Model<M>,
    filter?: FilterQuery<M>,
  ): Promise<M[]> {
    return await mongoModel.find(filter);
  }

  /**
   * Upserts a document based on the given filter and update data.
   *
   * @template M - The document type extending Mongoose's Document.
   * @param {any} filter - The filter query to match the document.
   * @param {UpdateWithAggregationPipeline | UpdateQuery<M>} update - The update data.
   * @param {Model<M>} mongoModel - The Mongoose model representing the document type.
   * @description This method performs an upsert operation, which creates a new document if
   *              none exists that matches the filter or updates the existing document.
   */
  async upsert<M extends Document>(
    filter: any,
    update: UpdateWithAggregationPipeline | UpdateQuery<M>,
    mongoModel: Model<M>,
  ) {
    await mongoModel.updateOne(filter, update, { upsert: true });
  }

  /**
   * Asynchronously deletes multiple documents from the MongoDB collection associated with the provided Mongoose model.
   *
   * @template M - A class that extends Mongoose's Document. Represents the type of the document.
   * @param {any} filter - The filter criteria to select documents for deletion. Uses MongoDB's query syntax.
   * @param {Model<M>} mongoModel - The Mongoose model representing the MongoDB collection from which documents will be deleted.
   * @returns {Promise<void>} A promise that resolves when the operation is complete. Does not return any value.
   */
  async deleteMany<M extends Document>(
    filter: any,
    mongoModel: Model<M>,
  ): Promise<void> {
    await mongoModel.deleteMany(filter);
  }

  /**
   * Asynchronously deletes a single document from the MongoDB collection associated with the provided Mongoose model.
   *
   * @template M - A class that extends Mongoose's Document. Represents the type of the document.
   * @param {any} filter - The filter criteria to select the document for deletion. Uses MongoDB's query syntax.
   * @param {Model<M>} mongoModel - The Mongoose model representing the MongoDB collection from which the document will be deleted.
   * @returns {Promise<void>} A promise that resolves when the operation is complete. Does not return any value.
   */
  async deleteOne<M extends Document>(
    filter: any,
    mongoModel: Model<M>,
  ): Promise<void> {
    await mongoModel.deleteOne(filter);
  }
  /**
   * Creates a new document in the MongoDB database.
   *
   * @template M - The document type extending Mongoose's Document.
   * @param {any} data - The data for the new document.
   * @param {Model<M>} mongoModel - The Mongoose model representing the document type.
   * @returns {Promise<M>} A promise that resolves to the newly created document.
   * @description This method creates a new document in the MongoDB database using the provided data
   *              and the specified Mongoose model.
   */
  async create<M extends Document>(
    data: any,
    mongoModel: Model<M>,
  ): Promise<M> {
    return await mongoModel.create(data);
  }
}
