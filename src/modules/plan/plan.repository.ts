import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { Paginator } from 'src/utils/paginator';

import { BaseEntitySelect } from '../base/base.entity';
import { CrudType } from '../base/interfaces/ICrudTypeMap';
import { Paginated } from '../base/interfaces/IPaginated';
import { PlanEntity } from './entity/plan.entity';
import { PlanTypeMap } from './entity/plan.type.map';

@Injectable()
export class PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFilteredAsync(
    filter: DefaultFilter<PlanTypeMap>,
    transaction?: Prisma.TransactionClient,
  ): Promise<Paginated<Partial<PlanEntity>>> {
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
    const prismaSelect: PlanTypeMap[CrudType.SELECT] = {
      ...BaseEntitySelect,
      name: true,
      description: true,
      popular: true,
      buttonText: true,
      benefitList: true,
      planIdPlatform: true,
      price: true,
    };

    return await Paginator.applyPagination(prisma.plan, {
      ...filter,
      where: { AND },
      select: prismaSelect,
    });
  }

  async findBy(
    where: PlanTypeMap[CrudType.WHERE],
    select: PlanTypeMap[CrudType.SELECT],
    orderBy?: PlanTypeMap[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ) {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const data = await prisma.plan.findFirst({
      where,
      select,
      orderBy,
    });

    return data;
  }

  async findByIdAsync(
    id: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<PlanEntity> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.plan.findUnique({
      where: {
        id,
      },
    });
  }

  async createAsync(
    data: PlanTypeMap[CrudType.CREATE] | PlanTypeMap[CrudType.CREATE_UNCHECKED],
    transaction?: Prisma.TransactionClient,
  ): Promise<Partial<PlanEntity>> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.plan.create({
      data,
    });
  }

  async findAllBy(
    where: PlanTypeMap[CrudType.WHERE],
    select: PlanTypeMap[CrudType.SELECT],
    orderBy?: PlanTypeMap[CrudType.ORDER_BY],
    transaction?: Prisma.TransactionClient,
  ): Promise<Partial<PlanEntity[]>> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.plan.findMany({
      where,
      select,
      orderBy,
    });
  }

  async exists(
    where: PlanTypeMap[CrudType.WHERE],
    transaction?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    const plan = await prisma.plan.count({
      where,
    });

    return plan > 0;
  }
}
