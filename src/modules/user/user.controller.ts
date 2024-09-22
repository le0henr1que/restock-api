import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssignmentsEnum, RoleEnum } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Assignments } from 'src/auth/decorators/assignments.decorator';
import { AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRegisteredResponse } from 'src/auth/dto/response/UserToken';
import { RequestModel } from 'src/auth/models/Request';
import { UserPayload } from 'src/auth/models/UserPayload';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { AuditLogRequestInformation } from 'src/middlewares/interface/logger';
import { AssignmentPermission } from 'src/utils/constants';
import { getIpAddress, getLanguage } from 'src/utils/get-ip-address';
import {
  ApiExceptionResponse,
  ApiOkResponsePaginated,
} from 'src/utils/swagger-schemas/SwaggerSchema';

import { BaseController } from '../base/base.controller';
import { UpdateUserPersonalData } from './dto/request/update.personal.data.dto';
import { UpdateUserPassword } from './dto/request/update.personal.password.dto';
import { UserRestrictionBody } from './dto/request/user.block.dto';
import { UserCreateDto } from './dto/request/user.create.dto';
import { UserUpdateDto } from './dto/request/user.update.dto';
import { AssignmentsDto, RoleDto } from './dto/response/assignments.dto';
import { UserResponseDto } from './dto/response/user.dto';
import { UserPaginationResponse } from './dto/response/user.pagination.response';
import { UserEntity } from './entity/user.entity';
import { UserTypeMap } from './entity/user.type.map';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { verifyAccountCreateDtos } from './dto/request/verify.account.create.token.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    protected readonly service: UserService,
    protected readonly authService: AuthService,
  ) {
    this.service = service;
  }

  @ApiOperation({ summary: 'Get filtered user' })
  @ApiOkResponsePaginated(UserPaginationResponse)
  @ApiExceptionResponse()
  @Assignments({
    assignments: [AssignmentsEnum.USER],
    permissions: [AssignmentPermission.READ],
  })
  @Get()
  async getFilteredAsync(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Query() filter: DefaultFilter<UserTypeMap>,
    @Request() request: RequestModel,
  ) {
    const filteredData = await this.service.findFilteredAsync(
      filter,
      currentUser,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(filteredData);
  }

  @ApiOperation({ summary: 'Get one user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiExceptionResponse()
  @Assignments({
    assignments: [AssignmentsEnum.USER],
    permissions: [AssignmentPermission.READ],
  })
  @Get('/:id')
  protected async findByIdAsync(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Param('id') id: string,
    @Request() request: RequestModel,
  ) {
    const userById = await this.service.findByIdAsync(
      id,
      currentUser,
      getLanguage(request.headers['accept-language']),
      {
        mapper: {
          sourceClass: UserEntity,
          destinationClass: UserResponseDto,
        },
      },
    );

    return response.status(HttpStatus.OK).json(userById);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserRegisteredResponse,
  })
  @ApiBody({ type: UserCreateDto })
  @ApiExceptionResponse()
  @IsPublic()
  @Post()
  protected async createAsync(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Body() dto: UserCreateDto,
    @Request() request: RequestModel,
  ) {
    const data = await this.authService.register(
      dto,
      currentUser,
      new AuditLogRequestInformation(
        getIpAddress(request.headers['x-forwarded-for']),
        request.url,
        request.method,
      ),
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.CREATED).json(data);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBody({ type: UserUpdateDto })
  @ApiExceptionResponse()
  @Assignments({
    assignments: [AssignmentsEnum.USER],
    permissions: [AssignmentPermission.UPDATE],
  })
  @Put('/:id')
  protected async updateAsync(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() dto: UserUpdateDto,
    @Request() request: RequestModel,
  ) {
    await this.service.updateAsync(
      id,
      dto,
      currentUser,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'version',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiExceptionResponse()
  @Assignments({
    assignments: [AssignmentsEnum.USER],
    permissions: [AssignmentPermission.DELETE],
  })
  @Delete('/:id')
  protected async deleteAsync(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Param('id') id: string,
    @Query('version') version: number,
    @Request() request: RequestModel,
  ) {
    await this.service.deleteAsync(
      id,
      version,
      currentUser,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(id);
  }
  @ApiOperation({ summary: 'Verify create token user' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiExceptionResponse()
  @IsPublic()
  @Post('/verify')
  protected async verifyTokenUserAsync(
    @Res() response: Response,
    @Request() request: RequestModel,
    @Body() dto: verifyAccountCreateDtos,
  ) {
    await this.service.verifyCodeAccountCreate(
      dto.token,
      dto.userId,
      getLanguage(request.headers['accept-language']),
    );
    return response.status(HttpStatus.OK).json();
  }

  @ApiOperation({ summary: 'Resend token user' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiExceptionResponse()
  @IsPublic()
  @Post('/verify/resend')
  protected async resendTokenAsyn(
    @Res() response: Response,
    @Request() request: RequestModel,
    @Body() dto: verifyAccountCreateDtos,
  ) {
    console.log('1');
    await this.service.resendTokenAsyn(
      dto.userId,
      getLanguage(request.headers['accept-language']),
    );
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Resend token success' });
  }

  @ApiOperation({ summary: 'Get assignments' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [AssignmentsDto],
  })
  @ApiExceptionResponse()
  @Assignments({
    assignments: [AssignmentsEnum.USER],
    permissions: [AssignmentPermission.CREATE, AssignmentPermission.UPDATE],
  })
  @Get('search/assignments')
  protected async getAssignments(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    const assignments = await this.service.getAssignments(
      currentUser,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(assignments);
  }

  @ApiOperation({ summary: 'Get roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [RoleDto],
  })
  @ApiExceptionResponse()
  @Assignments({
    assignments: [AssignmentsEnum.USER],
    permissions: [AssignmentPermission.CREATE, AssignmentPermission.UPDATE],
  })
  @Get('search/roles')
  protected async getRoles(
    @AuthenticatedUser() currentUser: UserPayload,
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    const roles = await this.service.getRoles(
      currentUser,
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).json(roles);
  }

  @ApiOperation({ summary: 'Block users' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBody({ type: UserRestrictionBody })
  @ApiExceptionResponse()
  @Roles(RoleEnum.ADMIN)
  @Patch('block')
  protected async blockUsers(
    @AuthenticatedUser() currentUser: UserPayload,
    @Body() body: UserRestrictionBody,
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    await this.service.blockUsers(
      body,
      currentUser,
      new AuditLogRequestInformation(
        getIpAddress(request.headers['x-forwarded-for']),
        request.url,
        request.method,
      ),
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).send();
  }

  @ApiOperation({ summary: 'Unblock users' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBody({ type: UserRestrictionBody })
  @ApiExceptionResponse()
  @Roles(RoleEnum.ADMIN)
  @Patch('unblock')
  protected async unblockUsers(
    @AuthenticatedUser() currentUser: UserPayload,
    @Body() body: UserRestrictionBody,
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    await this.service.unblockUsers(
      body,
      currentUser,
      new AuditLogRequestInformation(
        getIpAddress(request.headers['x-forwarded-for']),
        request.url,
        request.method,
      ),
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).send();
  }

  @ApiOperation({ summary: 'Change personal password' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiExceptionResponse()
  @Patch('personal/password')
  protected async changePersonalPassword(
    @AuthenticatedUser() currentUser: UserPayload,
    @Body() body: UpdateUserPassword,
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    await this.service.updateUserPassword(
      body,
      currentUser,
      new AuditLogRequestInformation(
        getIpAddress(request.headers['x-forwarded-for']),
        request.url,
        request.method,
      ),
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).send();
  }

  @ApiOperation({ summary: 'Change personal data' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiExceptionResponse()
  @Patch('personal/data')
  protected async changePersonalData(
    @AuthenticatedUser() currentUser: UserPayload,
    @Body() body: UpdateUserPersonalData,
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    await this.service.updateUserPersonalData(
      body,
      currentUser,
      new AuditLogRequestInformation(
        getIpAddress(request.headers['x-forwarded-for']),
        request.url,
        request.method,
      ),
      getLanguage(request.headers['accept-language']),
    );

    return response.status(HttpStatus.OK).send();
  }
}
