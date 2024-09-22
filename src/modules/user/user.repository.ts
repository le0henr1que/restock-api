import { Injectable } from '@nestjs/common';
import { Prisma, RoleEnum, StatusEnum } from '@prisma/client';
import { User } from '@prisma/client';
import { UserPayload } from 'src/auth/models/UserPayload';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { Paginator } from 'src/utils/paginator';

import { BaseEntitySelect } from '../base/base.entity';
import { BaseRepository } from '../base/base.repository';
import { CrudType } from '../base/interfaces/ICrudTypeMap';
import { Paginated } from '../base/interfaces/IPaginated';
import { AssignmentsDto, RoleDto } from './dto/response/assignments.dto';
import { TUserPagination } from './dto/type/user.pagination';
import { UserEntity } from './entity/user.entity';
import { UserTypeMap } from './entity/user.type.map';

@Injectable()
export class UserRepository extends BaseRepository<UserTypeMap> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findFilteredAsync(
    filter: DefaultFilter<UserTypeMap>,
    user?: UserPayload,
    transaction?: Prisma.TransactionClient,
  ): Promise<Paginated<TUserPagination>> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const AND: Record<string, any>[] = [
      {
        status: {
          not: StatusEnum.INACTIVE,
        },
        deletedAt: null,
      },
    ];

    // if (filter.search) {
    //   filter.search = filter.search.trim();

    //   AND.push({
    //     OR: [
    //       {
    //         name: {
    //           contains: filter.search,
    //           mode: 'insensitive',
    //         },
    //       },
    //       {
    //         email: {
    //           contains: filter.search,
    //           mode: 'insensitive',
    //         },
    //       },
    //       {
    //         Roles: {
    //           some: {
    //             Role: {
    //               name: RoleEnum[
    //                 filter.search.toUpperCase() as keyof typeof RoleEnum
    //               ],
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   });
    // }

    if (user.organizationId) {
      AND.push({
        organizationUser: {
          some: {
            organizationId: user.organizationId,
            Roles: {
              some: {
                organizationId: user.organizationId,
              },
            },
          },
        },
      });
    }

    const prismaSelect: UserTypeMap[CrudType.SELECT] = {
      ...BaseEntitySelect,
      email: true,
      blocked: true,
      name: true,
      status: true,
      organizationUser: {
        where: { organizationId: user.organizationId },
        select: {
          Roles: {
            where: { organizationId: user.organizationId },
            select: { role: { select: { name: true } } },
          },
        },
      },
    };

    const result: any = await Paginator.applyPagination(prisma.user, {
      ...filter,
      where: { AND },
      select: prismaSelect,
    });

    return result as any;
  }

  async updateAsync(
    id: string,
    data: UserTypeMap[CrudType.UPDATE],
    transaction?: Prisma.TransactionClient,
  ): Promise<User> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await this.validateVersion(id, Number(data?.version), transaction);

    return await prisma.user.update({
      where: {
        id,
        version: Number(data.version),
      },
      data: {
        ...data,
        version: {
          increment: 1,
        },
      },
    });
  }

  async changeUserRestriction(
    userId: string,
    version: number,
    action: 'BLOCK' | 'UNBLOCK',
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await this.validateVersion(userId, version, transaction);

    await prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        ...(action === 'BLOCK'
          ? { blocked: true, loginAttempts: -1 }
          : { blocked: false, loginAttempts: 0 }),
        version: {
          increment: 1,
        },
      },
    });
  }

  async findBy(
    where: UserTypeMap[CrudType.WHERE],
    select: UserTypeMap[CrudType.SELECT],
    orderBy?: UserTypeMap[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.user.findFirst({
      where,
      select,
      orderBy,
    });
  }

  async findByIdAsync(
    id: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<any> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
        status: {
          not: StatusEnum.INACTIVE,
        },
      },

      include: {
        ownedOrganizations: true,
        organizationUser: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
            UserAssignment: {
              where: {
                Assignment: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                Assignment: true,
              },
            },
            Roles: {
              where: {
                role: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteAsync(
    id: string,
    version: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await this.validateVersion(id, Number(version), transaction);

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: StatusEnum.INACTIVE,
        deletedAt: new Date(),
        version: {
          increment: 1,
        },
      },
    });
  }

  async createAsync(
    data: UserTypeMap[CrudType.CREATE],
    transaction?: Prisma.TransactionClient,
  ): Promise<any> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.user.create({
      data: {
        ...data,
        status: StatusEnum.PENDING,
        version: 1,
      },
      include: {
        organizationUser: {
          include: {
            UserAssignment: {
              where: {
                Assignment: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                Assignment: true,
              },
            },
            Roles: {
              where: {
                role: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllBy(
    where: UserTypeMap[CrudType.WHERE],
    select: UserTypeMap[CrudType.SELECT],
    orderBy?: UserTypeMap[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ): Promise<Partial<UserEntity>[]> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.user.findMany({
      where,
      select,
      orderBy,
    });
  }

  async exists(
    where: UserTypeMap[CrudType.WHERE],
    transaction?: Prisma.TransactionClient,
  ) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const user = await prisma.user.count({
      where,
    });

    return user > 0;
  }

  async findByEmail(email: string, transaction?: Prisma.TransactionClient) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const user = await prisma.user.findUnique({
      where: { email: email?.trim()?.toLowerCase() },
      include: {
        ownedOrganizations: true,
        organizationUser: {
          include: {
            UserAssignment: {
              where: {
                Assignment: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                Assignment: true,
              },
            },
            Roles: {
              where: {
                role: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    return user;
  }

  async removeAllRoles(userId: string, transaction?: Prisma.TransactionClient) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        // Roles: {
        //   deleteMany: {},
        // },
      },
    });
  }

  async removeAllAssignments(
    userId: string,
    transaction?: Prisma.TransactionClient,
  ) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        // UserAssignment: {
        //   deleteMany: {},
        // },
      },
    });
  }

  async findAssignments(
    transaction?: Prisma.TransactionClient,
  ): Promise<AssignmentsDto[]> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.assignment.findMany({
      where: {
        status: StatusEnum.ACTIVE,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findRoles(transaction?: Prisma.TransactionClient): Promise<RoleDto[]> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.role.findMany({
      where: {
        status: StatusEnum.ACTIVE,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async updateUserPassword(
    id: string,
    password: string,
    transaction: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
        recoveryToken: null,
        version: {
          increment: 1,
        },
      },
    });
  }
}
