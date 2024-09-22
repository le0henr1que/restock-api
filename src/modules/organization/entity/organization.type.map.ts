import { Prisma } from '@prisma/client';

import { CrudTypeMap } from '../../base/interfaces/ICrudTypeMap';

export class OrganizationTypeMap implements CrudTypeMap {
  aggregate: Prisma.OrganizationAggregateArgs;
  count: Prisma.OrganizationCountArgs;
  create: Prisma.OrganizationCreateInput;
  createUnchecked: Prisma.OrganizationUncheckedCreateInput;
  delete: Prisma.OrganizationDeleteArgs;
  deleteMany: Prisma.OrganizationDeleteManyArgs;
  findFirst: Prisma.OrganizationFindFirstArgs;
  findMany: Prisma.OrganizationFindManyArgs;
  findUnique: Prisma.OrganizationFindUniqueArgs;
  update: Prisma.OrganizationUpdateInput;
  updateMany: Prisma.OrganizationUpdateManyArgs;
  upsert: Prisma.OrganizationUpsertArgs;
  where: Prisma.OrganizationWhereInput;
  select: Prisma.OrganizationSelect;
  orderBy: Prisma.OrganizationOrderByWithRelationInput;
}
