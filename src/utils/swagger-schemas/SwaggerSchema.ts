import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Paginated } from 'src/modules/base/interfaces/IPaginated';

import {
  BadRequestResponse,
  ConflictResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
} from './BaseExceptionSchema';

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(Paginated, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginated) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );

export const ApiExceptionResponse = () =>
  applyDecorators(
    ApiBadRequestResponse({
      type: BadRequestResponse,
      description: 'Bad Request',
    }),
    ApiConflictResponse({ type: ConflictResponse, description: 'Conflict' }),
    ApiNotFoundResponse({ type: NotFoundResponse, description: 'Not Found' }),
    ApiInternalServerErrorResponse({
      type: InternalServerErrorResponse,
      description: 'Internal Server Error',
    }),
  );
