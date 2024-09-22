export interface CrudTypeMap {
  aggregate: unknown;
  count: unknown;
  create: unknown;
  createUnchecked: unknown;
  delete: unknown;
  deleteMany: unknown;
  findFirst: unknown;
  findMany: unknown;
  findUnique: unknown;
  update: unknown;
  updateMany: unknown;
  upsert: unknown;
  where: unknown;
  select: unknown;
  orderBy: unknown;
}

export enum CrudType {
  AGGREGATE = 'aggregate',
  COUNT = 'count',
  CREATE = 'create',
  CREATE_UNCHECKED = 'createUnchecked',
  DELETE = 'delete',
  DELETE_MANY = 'deleteMany',
  FIND_FIRST = 'findFirst',
  FIND_MANY = 'findMany',
  FIND_UNIQUE = 'findUnique',
  UPDATE = 'update',
  UPDATE_MANY = 'updateMany',
  UPSERT = 'upsert',
  WHERE = 'where',
  SELECT = 'select',
  ORDER_BY = 'orderBy',
}
