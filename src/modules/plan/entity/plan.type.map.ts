import { Prisma } from '@prisma/client';

import { CrudTypeMap } from '../../base/interfaces/ICrudTypeMap';

export class PlanTypeMap implements CrudTypeMap {
  aggregate: Prisma.PlanAggregateArgs;
  count: Prisma.PlanCountArgs;
  create: Prisma.PlanCreateInput;
  createUnchecked: Prisma.PlanUncheckedCreateInput;
  delete: Prisma.PlanDeleteArgs;
  deleteMany: Prisma.PlanDeleteManyArgs;
  findFirst: Prisma.PlanFindFirstArgs;
  findMany: Prisma.PlanFindManyArgs;
  findUnique: Prisma.PlanFindUniqueArgs;
  update: Prisma.PlanUpdateInput;
  updateMany: Prisma.PlanUpdateManyArgs;
  upsert: Prisma.PlanUpsertArgs;
  where: Prisma.PlanWhereInput;
  select: Prisma.PlanSelect;
  orderBy: Prisma.PlanOrderByWithRelationInput;
}
