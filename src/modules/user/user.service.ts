import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LogActionEnum,
  LogStatusEnum,
  MethodEnum,
  Prisma,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { isNumber } from 'class-validator';
import { randomUUID } from 'crypto';
import { UserPayload } from 'src/auth/models/UserPayload';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import {
  MessagesHelperKey,
  getMessage,
  setMessage,
} from 'src/helpers/messages.helper';
import {
  AuditLog,
  AuditLogRequestInformation,
} from 'src/middlewares/interface/logger';
import { isDevelopmentEnviroment } from 'src/utils/environment';
import { guardUser } from 'src/utils/guards/guard-user';
import { hashData } from 'src/utils/hash';
import { Languages } from 'src/utils/language-preference';
import { hasOptionalMapper } from 'src/utils/optional';
import { handleError } from 'src/utils/treat.exceptions';

import { readFileSync } from 'fs';
import { generateVerificationCode } from 'src/utils/handle-token-verification';
import { registrationTemplateDataBind } from 'src/utils/templates/processors/registration-processor';
import { CrudType } from '../base/interfaces/ICrudTypeMap';
import { Paginated } from '../base/interfaces/IPaginated';
import { EmailService } from '../email/email.service';
import { LogService } from '../log/log.service';
import { WebsocketService } from '../websocket/websocket.service';
import { UpdateUserPersonalData } from './dto/request/update.personal.data.dto';
import { UpdateUserPassword } from './dto/request/update.personal.password.dto';
import { UserRestrictionBody } from './dto/request/user.block.dto';
import { UserUpdateDto } from './dto/request/user.update.dto';
import { AssignmentsDto, RoleDto } from './dto/response/assignments.dto';
import { UserPaginationResponse } from './dto/response/user.pagination.response';
import { UserEntity } from './entity/user.entity';
import { UserTypeMap } from './entity/user.type.map';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    protected readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly logService: LogService,
    private readonly websocketService: WebsocketService,
    private readonly prisma: PrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly emailService: EmailService,
    // private readonly stipeService: StripeService,
  ) {}

  async createAsync(
    data: UserTypeMap[CrudType.CREATE],
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<UserEntity> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    this.logger.log(`${identifierRequest} Create user`);

    const executeCreate = async (transaction: Prisma.TransactionClient) => {
      if (
        (await this.exists(
          { email: data.email.trim() },
          currentUser,
          languagePreference,
          {
            transaction,
          },
        )) === true
      ) {
        this.logger.debug(`${identifierRequest} Email already exists`);
        throw new ConflictException(
          getMessage(
            MessagesHelperKey.EMAIL_ALREADY_EXISTS,
            languagePreference,
          ),
        );
      }

      return await this.userRepository.createAsync(data, transaction);
    };

    try {
      if (optionals?.transaction) {
        this.logger.debug(`${identifierRequest} Executing in transaction`);

        return await executeCreate(optionals?.transaction);
      } else {
        this.logger.debug(
          `${identifierRequest} Transaction doesn't exists, creating a new transaction`,
        );

        return this.prisma.$transaction(async (newTransaction) => {
          return await executeCreate(newTransaction);
        });
      }
    } catch (error) {
      this.logger.debug(`${identifierRequest} rollin back transaction`);
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async updateAsync(
    id: string,
    data: UserUpdateDto,
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<any> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    this.logger.log(`${identifierRequest} Update user`);

    // if (currentUser.id === id && !currentUser.roles.includes(RoleEnum.ADMIN)) {
    //   this.logger.warn(
    //     `${identifierRequest} User is trying to update itself, returning without changes`,
    //   );

    //   throw new ForbiddenException(
    //     getMessage(MessagesHelperKey.USER_UPDATE_YOURSELF, languagePreference),
    //   );
    // }

    // const executeUpdate = async (transaction: Prisma.TransactionClient) => {
    //   if (id == null || id.trim() == '') {
    //     this.logger.debug(`${identifierRequest} Id is required`);
    //     throw new BadRequestException(
    //       getMessage(MessagesHelperKey.ID_REQUIRED, languagePreference),
    //     );
    //   }

    //   if (
    //     (await this.exists({ id }, currentUser, languagePreference, {
    //       transaction,
    //     })) === false
    //   ) {
    //     this.logger.debug(`${identifierRequest} user not found`);
    //     throw new NotFoundException(
    //       setMessage(
    //         getMessage(MessagesHelperKey.USER_NOT_FOUND, languagePreference),
    //         id,
    //       ),
    //     );
    //   }

    //   const userPreUpdate = (await this.findByIdAsync(
    //     id,
    //     currentUser,
    //     languagePreference,
    //     {
    //       transaction,
    //     },
    //   )) as UserEntity;

    //   const userUpdateInput: Prisma.UserUpdateInput = {
    //     version: data.version,
    //   };

    //   if (data.name) userUpdateInput.name = data.name;

    //   if (data.email) {
    //     if (
    //       (await this.exists(
    //         { email: data.email, id: { not: id } },
    //         currentUser,
    //         languagePreference,
    //         {
    //           transaction,
    //         },
    //       )) === true
    //     ) {
    //       this.logger.debug(`${identifierRequest} Email already exists`);
    //       throw new ConflictException(
    //         getMessage(
    //           MessagesHelperKey.EMAIL_ALREADY_EXISTS,
    //           languagePreference,
    //         ),
    //       );
    //     }

    //     userUpdateInput.email = data.email;
    //   }

    //   if (data.mediaUrl) {
    //     this.logger.debug(`${identifierRequest} Has mediaUrl`);

    //     userUpdateInput.Media = {
    //       upsert: {
    //         where: {
    //           id: userPreUpdate?.mediaId || undefined,
    //         },
    //         create: {
    //           url: data.mediaUrl,
    //         },
    //         update: {
    //           url: data.mediaUrl,
    //         },
    //       },
    //     };
    //   }

    //   if (data.rolesIds && data.rolesIds.length > 0) {
    //     this.logger.debug(`${identifierRequest} Updating roles`);

    //     await this.userRepository.removeAllRoles(id, transaction);

    //     userUpdateInput.Roles = {
    //       create: data.rolesIds.map((roleId) => ({
    //         Role: {
    //           connect: {
    //             id: roleId,
    //           },
    //         },
    //       })),
    //     };
    //   }

    //   if (data.assignments && data.assignments.length > 0) {
    //     this.logger.debug(`${identifierRequest} Update assignments`);

    //     await this.userRepository.removeAllAssignments(id, transaction);

    //     userUpdateInput.UserAssignment = {
    //       create: data.assignments.map((assignment) => ({
    //         create: assignment.create,
    //         read: assignment.read,
    //         update: assignment.update,
    //         delete: assignment.delete,
    //         Assignment: {
    //           connect: {
    //             id: assignment.assignmentId,
    //           },
    //         },
    //       })),
    //     };
    //   }

    //   const userUpdated = await this.userRepository.updateAsync(
    //     id,
    //     userUpdateInput,
    //     transaction,
    //   );

    //   // Used to maintain history of changes for the user and who edited it
    //   const userPreUpdateJson = JSON.stringify({
    //     id: userPreUpdate?.id,
    //     name: userPreUpdate.name,
    //     email: userPreUpdate.email,
    //     UserAssignment: userPreUpdate?.UserAssignment?.map((userAssignment) => {
    //       return {
    //         id: userAssignment?.id,
    //         name: userAssignment?.Assignment?.name,
    //         create: userAssignment?.create,
    //         read: userAssignment?.read,
    //         update: userAssignment?.update,
    //         delete: userAssignment?.delete,
    //       };
    //     }),
    //     Roles: userPreUpdate?.Roles?.map((role) => {
    //       return {
    //         id: role?.id,
    //         name: role?.Role?.name,
    //       };
    //     }),
    //     status: userPreUpdate?.status,
    //     version: userPreUpdate?.version,
    //   });

    //   this.logger.debug(`${identifierRequest} User history created for logs`);

    //   await this.logService.createAuditLog(
    //     new AuditLog(
    //       'update',
    //       currentUser.ip,
    //       `/usuarios/${id}`,
    //       MethodEnum.PUT,
    //       currentUser.email,
    //       LogStatusEnum.SUCCESS,
    //       LogActionEnum.UPDATE,
    //       setMessage(
    //         getMessage(MessagesHelperKey.USER_UPDATED_SUCCESS, 'pt-BR'),
    //         userPreUpdate.email,
    //         userPreUpdateJson,
    //       ),
    //     ),
    //     {
    //       identifierRequest,
    //       transaction: transaction,
    //     },
    //   );

    //   return userUpdated;
    // };

    // try {
    //   if (optionals?.transaction) {
    //     this.logger.debug(`${identifierRequest} Executing in transaction`);

    //     return await executeUpdate(optionals?.transaction);
    //   } else {
    //     this.logger.debug(
    //       `${identifierRequest} Transaction doesn't exists, creating a new transaction`,
    //     );

    //     return this.prisma.$transaction(async (newTransaction) => {
    //       return await executeUpdate(newTransaction);
    //     });
    //   }
    // } catch (error) {
    //   this.logger.debug(`${identifierRequest} rollin back transaction`);

    //   await this.logService.createAuditLog(
    //     new AuditLog(
    //       'update',
    //       currentUser.ip,
    //       `/usuarios/${id}`,
    //       MethodEnum.PUT,
    //       currentUser.email,
    //       LogStatusEnum.ERROR,
    //       LogActionEnum.UPDATE,
    //       setMessage(
    //         getMessage(MessagesHelperKey.USER_UPDATED_ERROR, 'pt-BR'),
    //         id,
    //       ),
    //     ),
    //     {
    //       identifierRequest,
    //     },
    //   );

    //   handleError(error, languagePreference, {
    //     identifierRequest,
    //   });
    // }
  }

  async deleteAsync(
    id: string,
    version: number,
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<void> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    this.logger.log(`${identifierRequest} Delete user`);

    if (id == null || id.trim() == '') {
      this.logger.debug(`${identifierRequest} Id is required`);
      throw new BadRequestException(
        getMessage(MessagesHelperKey.ID_REQUIRED, languagePreference),
      );
    }

    if (version == null || isNumber(version) === false) {
      this.logger.debug(`${identifierRequest} Version is required`);
      throw new BadRequestException(
        getMessage(MessagesHelperKey.VERSION_REQUIRED, languagePreference),
      );
    }

    const executeDelete = async (transaction: Prisma.TransactionClient) => {
      if (
        (await this.exists({ id }, currentUser, languagePreference, {
          transaction,
        })) === false
      ) {
        this.logger.debug(`${identifierRequest} User not found`);
        throw new NotFoundException(
          setMessage(
            getMessage(MessagesHelperKey.USER_NOT_FOUND, languagePreference),
            id,
          ),
        );
      }

      const userToBeDeleted = (await this.findByIdAsync(
        id,
        currentUser,
        languagePreference,
        {
          transaction,
        },
      )) as UserEntity;

      await this.userRepository.deleteAsync(id, version, transaction);

      await this.logService.createAuditLog(
        new AuditLog(
          'delete',
          currentUser.ip,
          `/usuarios/${id}`,
          MethodEnum.DELETE,
          currentUser.email,
          LogStatusEnum.SUCCESS,
          LogActionEnum.DELETE,
          setMessage(
            getMessage(MessagesHelperKey.USER_DELETED_SUCCESS, 'pt-BR'),
            userToBeDeleted.email,
          ),
        ),
        {
          identifierRequest,
          transaction: transaction,
        },
      );
    };

    try {
      if (optionals?.transaction) {
        this.logger.debug(`${identifierRequest} Executing in transaction`);

        await executeDelete(optionals?.transaction);
      } else {
        this.logger.debug(
          `${identifierRequest} Transaction doesn't exists, creating a new transaction`,
        );

        await this.prisma.$transaction(async (newTransaction) => {
          await executeDelete(newTransaction);
        });
      }
    } catch (error) {
      this.logger.debug(`${identifierRequest} rollin back transaction`);

      await this.logService.createAuditLog(
        new AuditLog(
          'delete',
          currentUser.ip,
          `/usuarios/${id}`,
          MethodEnum.DELETE,
          currentUser.email,
          LogStatusEnum.ERROR,
          LogActionEnum.DELETE,
          setMessage(
            getMessage(MessagesHelperKey.USER_DELETED_ERROR, 'pt-BR'),
            id,
          ),
        ),
        {
          identifierRequest,
        },
      );

      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async findByIdAsync<S, T>(
    id: string,
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
      mapper?: {
        sourceClass: new () => S;
        destinationClass: new () => T;
      };
    },
  ): Promise<UserEntity | T> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Find by id`);

      if (id == null || id.trim() == '') {
        this.logger.debug(`${identifierRequest} Id is required`);
        throw new BadRequestException(
          getMessage(MessagesHelperKey.ID_REQUIRED, languagePreference),
        );
      }

      if (
        (await this.exists({ id }, currentUser, languagePreference, {
          transaction: optionals?.transaction,
        })) === false
      ) {
        this.logger.debug(`${identifierRequest} User not found`);
        throw new NotFoundException(
          setMessage(
            getMessage(MessagesHelperKey.USER_NOT_FOUND, languagePreference),
            id,
          ),
        );
      }

      const data = await this.userRepository.findByIdAsync(
        id,
        optionals?.transaction,
      );

      const { ownedOrganizations, organizationUser, ...rest } = data;

      const { Roles, UserAssignment } = organizationUser.find(
        (org) => org.id !== currentUser.organizationId,
      );

      console.log(Roles, UserAssignment);
      if (!data) {
        throw new ForbiddenException(
          setMessage(
            getMessage(MessagesHelperKey.USER_INACTIVE, languagePreference),
            id,
          ),
        );
      }

      //TODO: ajustar auto mapper

      // if (hasOptionalMapper(optionals)) {
      //   const destination = optionals.mapper.destinationClass;
      //   const source = optionals.mapper.sourceClass;
      //   const mapperToArray = Array.isArray(data);

      //   return this.mapperEntity<S, InstanceType<typeof destination>>(
      //     rest as InstanceType<typeof source>,
      //     source,
      //     destination,
      //     mapperToArray,
      //   ) as T;
      // }

      return {
        ...rest,
        roles: Roles.map((role) => role?.role?.name),
        assignments: UserAssignment?.map((userAssignment) => {
          return {
            assignment: userAssignment?.Assignment?.name,
            create: userAssignment?.create,
            read: userAssignment?.read,
            update: userAssignment?.update,
            delete: userAssignment?.delete,
          };
        }),
      };
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }
  async resendTokenAsyn(
    id: string,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<boolean> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Verify code account create`);

      const user = await this.userRepository.findByIdAsync(
        id,
        optionals?.transaction,
      );

      if (user == null) {
        this.logger.debug(`${identifierRequest} User not found`);
        throw new BadRequestException(
          setMessage(
            getMessage(
              MessagesHelperKey.CODE_VERIFICATION_INVALID,
              languagePreference,
            ),
            id,
          ),
        );
      }
      const userCode = await generateVerificationCode(6);
      const templatePath = 'src/utils/templates/verification-code.html';
      const templateHtml = readFileSync(templatePath).toString();
      console.log('2');
      if (!templateHtml || templateHtml == '') {
        this.logger.debug(`${identifierRequest} Template not found`);
        throw new Error(
          'Não foi possível encontrar o template de registro de email',
        );
      }
      const templateBody = registrationTemplateDataBind(templateHtml, {
        name: user.name,
        userCode,
      });
      console.log(userCode);
      const subject = 'Email de código de verificação';
      console.log('chegou aqui');
      //TODO: croar logica para dev e prod
      await this.emailService.sendEmail(
        templateBody,
        subject,
        user.email,
        languagePreference,
        {
          identifierRequest,
        },
      );
      console.log('3');
      await this.userRepository.updateAsync(
        id,
        {
          isEmailVerified: true,
          version: user.version,
          emailVerificationToken: userCode,
        },
        optionals?.transaction,
      );
      return true;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }
  async verifyCodeAccountCreate(
    code: string,
    id: string,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<boolean> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Verify code account create`);

      const user = await this.userRepository.findByIdAsync(
        id,
        optionals?.transaction,
      );

      if (user == null) {
        this.logger.debug(`${identifierRequest} User not found`);
        throw new BadRequestException(
          setMessage(
            getMessage(
              MessagesHelperKey.CODE_VERIFICATION_INVALID,
              languagePreference,
            ),
            code,
          ),
        );
      }
      console.log(user.emailVerificationToken.toString(), 'TOKEN BANCO');
      console.log(code, 'TOKEN API');
      if (user.emailVerificationToken.toString() !== code.toString()) {
        this.logger.debug(`${identifierRequest} Code verification is invalid`);
        throw new BadRequestException(
          setMessage(
            getMessage(
              MessagesHelperKey.CODE_VERIFICATION_INVALID,
              languagePreference,
            ),
            code,
          ),
        );
      }
      await this.userRepository.updateAsync(
        id,
        { isEmailVerified: true, version: user.version },
        optionals?.transaction,
      );

      return true;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async exists(
    where: UserTypeMap[CrudType.WHERE],
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<boolean> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} exists`);

      return await this.userRepository.exists(where, optionals?.transaction);
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async findBy<S, T>(
    where: UserTypeMap[CrudType.WHERE],
    select: UserTypeMap[CrudType.SELECT],
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      orderBy?: UserTypeMap[CrudType.ORDER_BY];
      transaction?: Prisma.TransactionClient;
      identifierRequest?: string;
      mapper?: {
        sourceClass: new () => S;
        destinationClass: new () => T;
      };
    },
  ): Promise<Partial<UserEntity> | T> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Find by`);

      if (
        (await this.exists(where, currentUser, languagePreference, {
          transaction: optionals?.transaction,
        })) === false
      ) {
        this.logger.debug(`${identifierRequest} User not found`);
        throw new NotFoundException(
          setMessage(
            getMessage(MessagesHelperKey.USER_NOT_FOUND, languagePreference),
            '',
          ),
        );
      }

      const data = await this.userRepository.findBy(
        where,
        select,
        optionals?.orderBy,
        optionals?.transaction,
      );

      if (hasOptionalMapper(optionals)) {
        const destination = optionals.mapper.destinationClass;
        const source = optionals.mapper.sourceClass;
        const mapperToArray = Array.isArray(data);

        return this.mapperEntity<S, InstanceType<typeof destination>>(
          data as InstanceType<typeof source>,
          source,
          destination,
          mapperToArray,
        ) as T;
      }

      return data;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async findAllBy<S, T>(
    where: UserTypeMap[CrudType.WHERE],
    select: UserTypeMap[CrudType.SELECT],
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      orderBy?: UserTypeMap[CrudType.ORDER_BY];
      transaction?: Prisma.TransactionClient;
      identifierRequest?: string;
      mapper?: {
        sourceClass: new () => S;
        destinationClass: new () => T;
      };
    },
  ): Promise<Partial<UserEntity>[] | T[]> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Find all by`);

      if (
        (await this.exists(where, currentUser, languagePreference, {
          transaction: optionals?.transaction,
        })) === false
      ) {
        this.logger.debug(`${identifierRequest} User not found`);
        throw new NotFoundException(
          getMessage(MessagesHelperKey.USERS_NOT_FOUND, languagePreference),
        );
      }

      const data = await this.userRepository.findAllBy(
        where,
        select,
        optionals?.orderBy,
        optionals?.transaction,
      );

      if (hasOptionalMapper(optionals)) {
        const destination = optionals.mapper.destinationClass;
        const source = optionals.mapper.sourceClass;
        const mapperToArray = Array.isArray(data);

        return this.mapperEntity<S, InstanceType<typeof destination>>(
          data as InstanceType<typeof source>,
          source,
          destination,
          mapperToArray,
        ) as T[];
      }

      return data;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async findFilteredAsync(
    filter: DefaultFilter<UserTypeMap>,
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<Paginated<Partial<UserPaginationResponse>>> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Find filtered async`);

      const userFiltered = await this.userRepository.findFilteredAsync(
        filter,
        currentUser,
        optionals?.transaction,
      );

      const data = userFiltered.data.map((user) => {
        const { organizationUser, ...rest } = user;
        return {
          ...rest,
          role: organizationUser.flatMap((orgUser: any) =>
            orgUser.Roles.map((roleObj: any) => roleObj.role.name),
          ),
        };
      });

      return {
        ...userFiltered,
        data,
      };
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async findByEmail(
    email: string,
    languagePreference: Languages,
    optionals?: {
      transaction?: Prisma.TransactionClient;
      identifierRequest?: string;
    },
  ) {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.log(`${identifierRequest} Find by email`);

      const user = await this.userRepository.findByEmail(
        email,
        optionals?.transaction,
      );

      return user;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async getAssignments(
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<AssignmentsDto[]> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.debug(`${identifierRequest} Get in assignments`);
      const assignments: AssignmentsDto[] =
        await this.userRepository.findAssignments(optionals?.transaction);

      return assignments;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async getRoles(
    currentUser: UserPayload,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<RoleDto[]> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.debug(`${identifierRequest} Get in roles`);
      const roles: RoleDto[] = await this.userRepository.findRoles(
        optionals?.transaction,
      );

      return roles;
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  public async blockUsers(
    body: UserRestrictionBody,
    currentUser: UserPayload,
    request: AuditLogRequestInformation,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ) {
    const identifierRequest = optionals?.identifierRequest || randomUUID();

    const functionName = 'blockUsers';

    this.logger.debug(`${identifierRequest} Block users`);

    try {
      await this.userRepository.changeUserRestriction(
        body.id,
        body.version,
        'BLOCK',
        optionals?.transaction,
      );

      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          currentUser.email,
          LogStatusEnum.SUCCESS,
          LogActionEnum.BLOCK,
          setMessage(
            getMessage(MessagesHelperKey.USER_BLOCKED_BY_ADMIN, 'pt-BR'),
            body.id,
          ),
        ),
        {
          identifierRequest,
          transaction: optionals?.transaction,
        },
      );

      this.websocketService.handleDisconnectUserBlocked(body.id);

      this.logger.debug(`${identifierRequest} Event disconnect emitted`);

      this.logger.debug(`${identifierRequest} blocked user ${body.id}`);

      return;
    } catch (error) {
      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          currentUser.email,
          LogStatusEnum.ERROR,
          LogActionEnum.BLOCK,
          setMessage(
            getMessage(MessagesHelperKey.USER_BLOCKED_BY_ADMIN, 'pt-BR'),
            body.id,
          ),
        ),
        {
          identifierRequest,
        },
      );

      handleError(error, languagePreference, {
        identifierRequest,
        message: getMessage(MessagesHelperKey.BLOCK_ERROR, languagePreference),
      });
    }
  }

  public async unblockUsers(
    body: UserRestrictionBody,
    currentUser: UserPayload,
    request: AuditLogRequestInformation,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ) {
    const identifierRequest = optionals?.identifierRequest || randomUUID();

    const functionName = 'unblockUsers';

    this.logger.debug(`${identifierRequest} Unblock users`);

    try {
      await this.userRepository.changeUserRestriction(
        body.id,
        body.version,
        'UNBLOCK',
        optionals?.transaction,
      );

      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          currentUser.email,
          LogStatusEnum.SUCCESS,
          LogActionEnum.UNBLOCK,
          setMessage(
            getMessage(MessagesHelperKey.USER_UNBLOCKED_SUCCESS, 'pt-BR'),
            body.id,
          ),
        ),
        {
          identifierRequest,
          transaction: optionals?.transaction,
        },
      );

      this.logger.debug(`${identifierRequest} unblocked user ${body.id}`);

      return;
    } catch (error) {
      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          currentUser.email,
          LogStatusEnum.ERROR,
          LogActionEnum.UNBLOCK,
          setMessage(
            getMessage(MessagesHelperKey.USER_UNBLOCKED_ERROR, 'pt-BR'),
            body.id,
          ),
        ),
        {
          identifierRequest,
        },
      );

      handleError(error, languagePreference, {
        identifierRequest,
        message: getMessage(
          MessagesHelperKey.UNBLOCK_ERROR,
          languagePreference,
        ),
      });
    }
  }

  async updateUserPassword(
    body: UpdateUserPassword,
    currentUser: UserPayload,
    request: AuditLogRequestInformation,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ): Promise<void> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    const functionName = 'updateUserPassword';

    this.logger.debug(`${identifierRequest} Update user password`);

    if (body.actualPassword === body.newPassword) {
      throw new BadRequestException(
        getMessage(MessagesHelperKey.PASSWORD_ARE_EQUALS, languagePreference),
      );
    }

    const user = await this.userRepository.findByIdAsync(
      currentUser.id,
      optionals?.transaction,
    );

    const execute = async (transaction: Prisma.TransactionClient) => {
      const isPasswordValid = await bcrypt.compare(
        body.actualPassword,
        user.password,
      );

      if (!isPasswordValid) {
        this.logger.debug(
          `${identifierRequest} Password validation is invalid`,
        );

        await this.logService.createAuditLog(
          new AuditLog(
            functionName,
            request.ip,
            request.url,
            MethodEnum[request.method],
            user.email,
            LogStatusEnum.ERROR,
            LogActionEnum.CHANGE_PERSONAL_INFORMATION,
            setMessage(
              getMessage(MessagesHelperKey.PASSWORD_CHANGED_ERROR, 'pt-BR'),
              user.email,
              'As senhas não conferem',
            ),
          ),
          {
            identifierRequest,
            transaction: transaction,
          },
        );

        throw new BadRequestException(
          getMessage(MessagesHelperKey.PASSWORD_UNMATCH, languagePreference),
        );
      }

      if (isDevelopmentEnviroment()) {
        this.logger.debug(
          `${identifierRequest} [DEV] User password : ${body.newPassword}`,
        );
      }

      const hash = await hashData(body.newPassword);
      this.logger.debug(`${identifierRequest} Password hashed`);

      await this.userRepository.validateVersion(currentUser.id, body.version);
      await this.userRepository.updateUserPassword(
        currentUser.id,
        hash,
        transaction,
      );

      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          user.email,
          LogStatusEnum.SUCCESS,
          LogActionEnum.CHANGE_PERSONAL_INFORMATION,
          setMessage(
            getMessage(MessagesHelperKey.PASSWORD_CHANGED, 'pt-BR'),
            user.email,
          ),
        ),
        {
          identifierRequest,
          transaction: transaction,
        },
      );

      this.logger.debug(`${identifierRequest} User password updated`);
    };

    try {
      guardUser(
        {
          blocked: user?.blocked,
          deletedAt: user?.deletedAt,
          email: user?.email,
          status: user?.status,
        },
        this.logger,
        languagePreference,
        {
          identifierRequest,
        },
      );

      if (optionals?.transaction) {
        this.logger.debug(`${identifierRequest} Executing in transaction`);

        await execute(optionals?.transaction);
      } else {
        this.logger.debug(
          `${identifierRequest} Transaction doesn't exists, creating a new transaction`,
        );

        await this.prisma.$transaction(async (newTransaction) => {
          await execute(newTransaction);
        });
      }
    } catch (error) {
      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          user.email,
          LogStatusEnum.ERROR,
          LogActionEnum.CHANGE_PERSONAL_INFORMATION,
          setMessage(
            getMessage(MessagesHelperKey.PASSWORD_CHANGED_ERROR, 'pt-BR'),
            user.email,
          ),
        ),
        {
          identifierRequest,
        },
      );
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  async updateUserPersonalData(
    body: UpdateUserPersonalData,
    currentUser: UserPayload,
    request: AuditLogRequestInformation,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
      transaction?: Prisma.TransactionClient;
    },
  ) {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    const functionName = 'updateUserPersonalData';

    this.logger.debug(`${identifierRequest} Update user personal data`);

    if (!body?.name && !body?.mediaUrl) {
      this.logger.debug(
        `${identifierRequest} No data to update, returning without changes`,
      );

      return;
    }

    const user = await this.userRepository.findByIdAsync(
      currentUser?.id,
      optionals?.transaction,
    );

    guardUser(
      {
        blocked: user?.blocked,
        deletedAt: user?.deletedAt,
        email: user?.email,
        status: user?.status,
      },
      this.logger,
      languagePreference,
      {
        identifierRequest,
      },
    );

    const execute = async (transaction: Prisma.TransactionClient) => {
      const userUpdateInput: Prisma.UserUpdateInput = {
        version: body.version,
      };

      if (body.name) userUpdateInput.name = body.name;

      if (body.mediaUrl) {
        this.logger.debug(`${identifierRequest} Has mediaUrl`);

        userUpdateInput.Media = {
          upsert: {
            where: {
              id: user.mediaId || undefined,
            },
            create: {
              url: body.mediaUrl,
            },
            update: {
              url: body.mediaUrl,
            },
          },
        };
      }

      await this.userRepository.updateAsync(
        user.id,
        userUpdateInput,
        transaction,
      );

      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          user.email,
          LogStatusEnum.SUCCESS,
          LogActionEnum.CHANGE_PERSONAL_INFORMATION,
          setMessage(
            getMessage(MessagesHelperKey.PERSONAL_INFORMATION_UPDATED, 'pt-BR'),
            user.email,
          ),
        ),
        {
          identifierRequest,
          transaction: transaction,
        },
      );

      this.logger.debug(`${identifierRequest} User personal data updated`);
    };

    try {
      guardUser(
        {
          blocked: user?.blocked,
          deletedAt: user?.deletedAt,
          email: user?.email,
          status: user?.status,
        },
        this.logger,
        languagePreference,
        {
          identifierRequest,
        },
      );

      if (optionals?.transaction) {
        this.logger.debug(`${identifierRequest} Executing in transaction`);

        await execute(optionals?.transaction);
      } else {
        this.logger.debug(
          `${identifierRequest} Transaction doesn't exists, creating a new transaction`,
        );

        await this.prisma.$transaction(async (newTransaction) => {
          await execute(newTransaction);
        });
      }
    } catch (error) {
      await this.logService.createAuditLog(
        new AuditLog(
          functionName,
          request.ip,
          request.url,
          MethodEnum[request.method],
          user.email,
          LogStatusEnum.ERROR,
          LogActionEnum.CHANGE_PERSONAL_INFORMATION,
          setMessage(
            getMessage(
              MessagesHelperKey.PERSONAL_INFORMATION_UPDATED_ERROR,
              'pt-BR',
            ),
            user.email,
          ),
        ),
        {
          identifierRequest,
        },
      );
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  /**
   * Generate a token to be used in the email confirmation.
   * @param email
   * @param id
   * @param languagePreference
   * @param optionals
   * @returns
   */
  async encodeEmailToken(
    email: string,
    id: string,
    languagePreference: Languages,
    optionals?: {
      identifierRequest?: string;
    },
  ): Promise<string> {
    const identifierRequest = optionals?.identifierRequest || randomUUID();
    try {
      this.logger.debug(`${identifierRequest} Encode email token`);

      const payload = {
        sub: email,
        id: id,
      };

      return await this.jwtService.signAsync(payload, {
        secret: process.env.TK_EMAIL_SECRET,
        expiresIn: process.env.TK_EMAIL_LIFETIME,
      });
    } catch (error) {
      handleError(error, languagePreference, {
        identifierRequest,
      });
    }
  }

  /**
   * Maps an entity from one class to another asynchronously using a mapper.
   * @template TInput - The input entity class type.
   * @template TOutput - The output entity class type.
   * @param {TInput} user - The input entity object to be mapped.
   * @param {new () => TInput} inputClass - The class constructor for the input entity.
   * @returns {TOutput} - A promise that resolves to the mapped output entity.
   */
  mapperEntity<TInput, TOutput>(
    user: TInput | TInput[],
    inputClass: new () => TInput,
    outputClass: new () => TOutput,
    mapperArray: boolean,
  ): TOutput | TOutput[] {
    if (mapperArray) {
      return this.mapper.mapArray(user as TInput[], inputClass, outputClass);
    }

    return this.mapper.map(user as TInput, inputClass, outputClass);
  }
}
