import { BadRequestException } from '@nestjs/common';
import { PaginatedResult, createPaginator } from 'prisma-pagination';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { MessagesHelperKey, getMessage } from 'src/helpers/messages.helper';
import { BaseEntity } from 'src/modules/base/base.entity';
import { CrudTypeMap } from 'src/modules/base/interfaces/ICrudTypeMap';
import { Delegate } from 'src/modules/base/interfaces/IDelegate';

/**
 * A utility class for applying pagination to Prisma queries.
 */
export class Paginator {
  /**
   * Applies pagination to a Prisma entity query.
   *
   * @template P - The Prisma delegate type.
   * @template T - The entity type being paginated.
   * @template C - The type of the CRUD operation map.
   * @param {P} prismaEntity - The Prisma entity delegate.
   * @param {DefaultFilter<C>} filter - The filter criteria including pagination options.
   * @returns {Promise<T>} A promise that resolves to the paginated data.
   *
   * @description
   * This static method takes a Prisma entity and a filter object, applies pagination based on the filter,
   * and returns a promise that resolves to the paginated result. The method handles pagination logic using
   * the 'createPaginator' utility and throws a BadRequestException on error.
   */
  static async applyPagination<
    P extends Delegate,
    T extends BaseEntity,
    C extends CrudTypeMap,
  >(prismaEntity: P, filter: DefaultFilter<C>): Promise<PaginatedResult<T>> {
    const paginate = createPaginator({
      perPage: filter.perPage,
    });

    try {
      return await paginate<T, any>(
        prismaEntity,
        {
          where: filter.where,
          ...(filter.select && { select: filter.select }),
          orderBy: filter.orderBy,
        },
        {
          page: filter.page,
        },
      );
    } catch (error) {
      throw new BadRequestException(
        getMessage(MessagesHelperKey.DATA_PAGINATION_ERROR, 'pt-BR'),
      );
    }
  }
}
