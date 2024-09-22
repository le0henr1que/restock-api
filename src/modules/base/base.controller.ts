import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestModel } from 'src/auth/models/Request';
import { UserPayload } from 'src/auth/models/UserPayload';
import { DefaultFilter } from 'src/filters/DefaultFilter';

import { IBaseService } from './interfaces/IBaseService';
import { CrudTypeMap } from './interfaces/ICrudTypeMap';

@ApiBearerAuth()
@ApiHeader({
  name: 'x-forwarded-for',
  required: false,
  description: 'O endereço IP original do cliente conectado',
  schema: { type: 'string' },
})
@ApiHeader({
  name: 'accept-language',
  required: false,
  description: 'Linguagem de preferência do usuário',
  schema: {
    type: 'string',
    enum: ['en-US', 'pt-BR'],
    default: 'pt',
  },
})
export abstract class BaseController<
  T extends CrudTypeMap,
  CreateDto,
  UpdateDto,
> {
  constructor(protected service: IBaseService<T>) {}

  /**
   * Get end point
   *
   * @param {UserPayload} user - The user context for the operation.
   * @param {DefaultFilter<T>} filter - The filter criteria to apply.
   *
   * @description
   * This method should be implemented to retrieve records based on the provided filter criteria,
   * within the context of the authenticated user.
   */
  protected abstract getFilteredAsync(
    user: UserPayload,
    response: Response,
    filter: DefaultFilter<T>,
    request: RequestModel,
  );

  /**
   * Get :/id end point
   *
   * @param {UserPayload} user - The user context for the operation.
   * @param {string} id - The ID of the record to find.
   *
   * @description
   * This method should be implemented to retrieve a single record identified by the provided ID,
   * within the context of the authenticated user.
   */
  protected abstract findByIdAsync(
    user: UserPayload,
    response: Response,
    id: string,
    request: RequestModel,
  );

  /**
   * Post end point
   *
   * @param {UserPayload} user - The user context for the operation.
   * @param {CreateDto} dto - The data transfer object containing the data to create the record.
   * @param {RequestModel} [request] - Optional request model.
   *
   * @description
   * This method should be implemented to create a new record with the data provided in the DTO,
   * within the context of the authenticated user.
   */
  protected abstract createAsync(
    user: UserPayload,
    response: Response,
    dto: CreateDto,
    request: RequestModel,
  );

  /**
   * Update end point
   *
   * @param {UserPayload} user - The user context for the operation.
   * @param {string} id - The ID of the record to update.
   * @param {UpdateDto} dto - The data transfer object containing the update data.
   *
   * @description
   * This method should be implemented to update an existing record identified by the provided ID,
   * with the data provided in the DTO, within the context of the authenticated user.
   */
  protected abstract updateAsync(
    user: UserPayload,
    response: Response,
    id: string,
    dto: UpdateDto,
    request: RequestModel,
  );

  /**
   * Delete end point
   *
   * @param {Response} response - The HTTP response object.
   * @param {string} id - The ID of the record to delete.
   * @param {number} version - The version of the record for concurrency control.
   *
   * @description
   * This method should be implemented to delete a record identified by the provided ID,
   * within the context of the authenticated user. The version parameter is used for concurrency control.
   */
  protected abstract deleteAsync(
    user: UserPayload,
    response: Response,
    id: string,
    version: number,
    request: RequestModel,
  );
}
