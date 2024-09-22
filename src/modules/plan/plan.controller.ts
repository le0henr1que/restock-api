import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestModel } from 'src/auth/models/Request';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { getLanguage } from 'src/utils/get-ip-address';
import {
  ApiExceptionResponse,
  ApiOkResponsePaginated,
} from 'src/utils/swagger-schemas/SwaggerSchema';

import { PlanPaginationResponse } from './dto/response/plan.pagination.response';
import { PlanEntity } from './entity/plan.entity';
import { PlanTypeMap } from './entity/plan.type.map';
import { PlanService } from './plan.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('plan')
@ApiTags('Plan')
@IsPublic()
export class PlanController {
  constructor(protected readonly service: PlanService) {
    this.service = service;
  }

  @ApiOperation({ summary: 'Get filtered Plan' })
  @ApiOkResponsePaginated(PlanPaginationResponse)
  @ApiExceptionResponse()
  @Get()
  async getFilteredAsync(
    @Res() response: Response,
    @Query() filter: DefaultFilter<PlanTypeMap>,
    @Request() request: RequestModel,
  ) {
    const filteredData = await this.service.findFilteredAsync(
      filter,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(filteredData);
  }

  @ApiOperation({ summary: 'Get one Plan' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PlanEntity,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiExceptionResponse()
  @Get('/:id')
  protected async findByIdAsync(
    @Res() response: Response,
    @Param('id') id: string,
    @Request() request: RequestModel,
  ) {
    const data = await this.service.findByIdAsync(
      id,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(data);
  }
}
