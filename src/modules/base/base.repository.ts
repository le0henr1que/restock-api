/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserPayload } from 'src/auth/models/UserPayload';
import { DefaultFilter } from 'src/filters/DefaultFilter';

import { IBaseRepository } from './interfaces/IBaseRepository';
import { CrudType, CrudTypeMap } from './interfaces/ICrudTypeMap';
import { Paginated } from './interfaces/IPaginated';

/**
 * Abstract class representing the base repository with generic CRUD operations.
 *
 * @template T - Type extending CrudTypeMap for CRUD operation typings.
 */
export abstract class BaseRepository<T extends CrudTypeMap>
  implements IBaseRepository<T>
{
  /**
   * Finds records based on the provided filter.
   *
   * @param {DefaultFilter<T>} filter - The filter criteria.
   * @param {UserPayload} [user] - The user payload, optional.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   * @returns {Promise<Paginated<any>>} - A promise that resolves to paginated results.
   */
  abstract findFilteredAsync(
    filter: DefaultFilter<T>,
    user?: UserPayload,
    transaction?: Prisma.TransactionClient,
  ): Promise<Paginated<any>>;

  /**
   * Updates a record by its ID.
   *
   * @param {string} id - The ID of the record.
   * @param {T[CrudType.UPDATE]} data - The update data.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   */
  abstract updateAsync(
    id: string,
    data: T[CrudType.UPDATE],
    transaction?: Prisma.TransactionClient,
  );

  /**
   * Finds a record by its ID.
   *
   * @param {string} id - The ID of the record.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   */
  abstract findByIdAsync(id: string, transaction?: Prisma.TransactionClient);

  /**
   * Deletes a record by its ID.
   *
   * @param {string} id - The ID of the record.
   * @param {number} version - The version number for concurrency control.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   * @returns {Promise<void>} - A promise indicating the completion of the operation.
   */
  abstract deleteAsync(
    id: string,
    version: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;

  /**
   * Creates a new record.
   *
   * @param {T[CrudType.CREATE]} data - The creation data.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   * @returns {Promise<any>} - A promise that resolves to the newly created record.
   */
  abstract createAsync(
    data: T[CrudType.CREATE],
    transaction?: Prisma.TransactionClient,
  ): Promise<any>;

  /**
   * Checks if a record exists based on the specified criteria.
   *
   * @param {T[CrudType.WHERE]} where - The criteria for existence check.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the record exists, otherwise `false`.
   */
  abstract exists(
    where: T[CrudType.WHERE],
    transaction?: Prisma.TransactionClient,
  ): Promise<boolean>;

  /**
   * Finds a single record based on specified criteria and selection fields.
   *
   * @param {T[CrudType.WHERE]} where - The criteria for finding the record.
   * @param {T[CrudType.SELECT]} select - The fields to select.
   * @param {T[CrudType.ORDER_BY]} [orderBy] - The order by criteria, optional.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   */

  abstract findBy(
    where: T[CrudType.WHERE],
    select: T[CrudType.SELECT],
    orderBy?: T[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  );

  /**
   * Finds all records matching specified criteria and selection fields.
   * @param {T[CrudType.WHERE]} where - The criteria for finding records.
   * @param {T[CrudType.SELECT]} select - The fields to select in the found records.
   * @param {T[CrudType.ORDER_BY]} [orderBy] - The order by criteria, optional.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   * @returns {Promise<Partial<any>[]>} - A promise that resolves to an array of found records.
   */
  abstract findAllBy(
    where: T[CrudType.WHERE],
    select: T[CrudType.SELECT],
    orderBy?: T[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  );

  /**
   * Validates the version of a record for concurrency control.
   * Throws an exception if the version is not provided or if the record does not exist with the specified version.
   * @param {string} id - The ID of the record.
   * @param {number} version - The version number to validate.
   * @param {Prisma.TransactionClient} [transaction] - The Prisma transaction client, optional.
   * @throws {BadRequestException} - If the version is not provided.
   * @throws {ConflictException} - If the record with the given ID and version does not exist.
   */
  async validateVersion(
    id: string,
    version: number,
    transaction?: Prisma.TransactionClient,
  ) {
    if (version === undefined) {
      throw new BadRequestException('Version is required');
    }

    const existentUserWithVersion = await this.exists(
      { id, version: Number(version) },
      transaction,
    );

    if (!existentUserWithVersion) {
      throw new ConflictException('Não existe uma entidade com essa versão');
    }
  }
}
