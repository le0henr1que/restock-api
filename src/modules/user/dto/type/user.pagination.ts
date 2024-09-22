import { AutoMap } from '@automapper/classes';
import { RoleEnum, StatusEnum } from '@prisma/client';
import { BaseEntity } from 'src/modules/base/base.entity';

export class TUserPagination extends BaseEntity {
  @AutoMap()
  email: string;

  @AutoMap()
  name: string;

  @AutoMap()
  ip: string;

  @AutoMap()
  status: StatusEnum;

  @AutoMap()
  Roles: {
    Role: {
      name: RoleEnum;
    };
  }[];

  @AutoMap()
  blocked: boolean;
  organizationUser: any;
}
