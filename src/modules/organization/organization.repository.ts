import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { UserPayload } from 'src/auth/models/UserPayload';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { Paginator } from 'src/utils/paginator';

import { BaseEntitySelect } from '../base/base.entity';
import { BaseRepository } from '../base/base.repository';
import { CrudType } from '../base/interfaces/ICrudTypeMap';
import { Paginated } from '../base/interfaces/IPaginated';
import { OrganizationEntity } from './entity/organization.entity';
import { OrganizationTypeMap } from './entity/organization.type.map';

@Injectable()
export class OrganizationRepository extends BaseRepository<OrganizationTypeMap> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findFilteredAsync(
    filter: DefaultFilter<OrganizationTypeMap>,
    user?: UserPayload,
    transaction?: Prisma.TransactionClient,
  ): Promise<Paginated<Partial<OrganizationEntity>>> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const AND: Record<string, any>[] = [];

    if (filter.search) {
      AND.push({
        OR: [{}],
      });
    }

    // TODO-GENERATOR: Modify the select paginated of entity, if you want to select all entity, just remove the select from apply pagination
    const prismaSelect: OrganizationTypeMap[CrudType.SELECT] = {
      ...BaseEntitySelect,
    };

    return await Paginator.applyPagination(prisma.organization, {
      ...filter,
      where: { AND },
      select: prismaSelect,
    });
  }

  async updateAsync(
    id: string,
    data: OrganizationTypeMap[CrudType.UPDATE],
    transaction?: Prisma.TransactionClient,
  ): Promise<OrganizationEntity> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await this.validateVersion(id, Number(data.version), transaction);

    return await prisma.organization.update({
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

  async findBy(
    where: OrganizationTypeMap[CrudType.WHERE],
    select: OrganizationTypeMap[CrudType.SELECT],
    orderBy?: OrganizationTypeMap[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const data = await prisma.organization.findFirst({
      where,
      select,
      orderBy,
    });

    return data;
  }

  async findByIdAsync(
    id: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<OrganizationEntity> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.organization.findUnique({
      where: {
        id,
      },
      include: {
        subscription: {
          select: {
            plan: true,
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

    await prisma.organization.update({
      where: {
        id,
      },
      data: {
        status: StatusEnum.INACTIVE,
        deletedAt: new Date(),
      },
    });
  }

  async createAsync(
    data:
      | OrganizationTypeMap[CrudType.CREATE]
      | OrganizationTypeMap[CrudType.CREATE_UNCHECKED],
    transaction?: Prisma.TransactionClient,
  ): Promise<Partial<OrganizationEntity>> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.organization.create({
      data,
    });
  }

  async findAllBy(
    where: OrganizationTypeMap[CrudType.WHERE],
    select: OrganizationTypeMap[CrudType.SELECT],
    orderBy?: OrganizationTypeMap[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ): Promise<Partial<OrganizationEntity[]>> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.organization.findMany({
      where,
      select,
      orderBy,
    });
  }

  async exists(
    where: OrganizationTypeMap[CrudType.WHERE],
    transaction?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const organization = await prisma.organization.count({
      where,
    });

    return organization > 0;
  }
}
