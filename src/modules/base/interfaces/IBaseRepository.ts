import { Prisma } from '@prisma/client';
import { UserPayload } from 'src/auth/models/UserPayload';
import { DefaultFilter } from 'src/filters/DefaultFilter';

import { CrudType, CrudTypeMap } from './ICrudTypeMap';
import { Paginated } from './IPaginated';

/**
 * IBaseRepository<T> is a generic interface for the repositories.
 * T represents the entity type.
 */
export interface IBaseRepository<T extends CrudTypeMap> {
  /**
   * Finds entities based on filters and pagination options.
   *
   * @param filter - Filters and pagination options.
   * @param user - The user making the request, if applicable.
   * @param transaction - Optional transaction client.
   * @returns A paginated result.
   */
  findFilteredAsync(
    filter: DefaultFilter<T>,
    user?: UserPayload,
    transaction?: Prisma.TransactionClient,
  ): Promise<Paginated<Partial<any>>>;

  /**
   * Updates an entity.
   *
   * @param id - The identifier of the entity.
   * @param dto - The new data for the entity.
   * @param transaction - Optional transaction client.
   * @returns The updated entity.
   */
  updateAsync(
    id: string,
    data: T[CrudType.UPDATE],
    transaction?: Prisma.TransactionClient,
  ): Promise<any>;

  /**
   * Deletes an entity.
   *
   * @param id - The identifier of the entity.
   * @param version - The version of the entity.
   * @param transaction - Optional transaction client.
   */
  deleteAsync(
    id: string,
    version: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;

  /**
   * Finds an entity by its identifier.
   *
   * @param id - The identifier of the entity.
   * @param transaction - Optional transaction client.
   * @returns The entity if found, or null.
   */
  findByIdAsync(
    id: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<any>;

  /**
   * Creates a new entity.
   *
   * @param dto - The data for the new entity.
   * @param transaction - Optional transaction client.
   * @returns The created entity.
   */
  createAsync(
    dto: T[CrudType.CREATE],
    transaction?: Prisma.TransactionClient,
  ): Promise<any>;

  /**
   * Checks the existence of an entity based on given conditions.
   *
   * @param whereInput - The conditions to check.
   * @param transaction - Optional transaction client.
   * @returns True if an entity exists, false otherwise.
   */
  exists(
    whereInput: T[CrudType.WHERE],
    transaction?: Prisma.TransactionClient,
  ): Promise<boolean>;

  /**
   * Finds unique entity based on conditions and selected fields.
   *
   * @param whereInput - The conditions to check.
   * @param select - The fields to select.
   * @param transaction - Optional transaction client.
   * @param orderBy - Optional order by.
   * @returns The entitiy if found, or nothing.
   */
  findBy(
    whereInput: T[CrudType.WHERE],
    select: T[CrudType.SELECT],
    orderBy?: T[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ): Promise<any>;

  /**
   * Finds entities based on conditions and selected fields.
   *
   * @param whereInput - The conditions to check.
   * @param select - The fields to select.
   * @param orderBy - Optional order by.
   * @param transaction - Optional transaction client.
   * @returns The entitiies if found, or empty array.
   */
  findAllBy(
    whereInput: T[CrudType.WHERE],
    select: T[CrudType.SELECT],
    orderBy?: T[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ): Promise<any>;

  /**
   * Validate if the version of the entity is the same as the one in the database.
   *
   * @param id - The identifier of the entity.
   * @param version - The version of the entity.
   * @param transaction - Optional transaction client.
   * @returns throw an exception if the version is not the same.
   */
  validateVersion(
    id: string,
    version: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void>;
}
