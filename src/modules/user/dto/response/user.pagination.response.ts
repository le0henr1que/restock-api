import { AutoMap } from '@automapper/classes';
import { ApiResponseProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { BaseEntity } from 'src/modules/base/base.entity';

import { RoleDto } from './assignments.dto';

export class UserPaginationResponse extends BaseEntity {
  @ApiResponseProperty({
    example: 'john.doe@example.com',
  })
  @AutoMap()
  email: string;

  @ApiResponseProperty({
    example: 'John Doe',
  })
  @AutoMap()
  name: string;

  @ApiResponseProperty({
    example: 'ADMIN,USER',
    type: String,
  })
  role: RoleDto;

  @ApiResponseProperty({
    example: 'ACTIVE',
    enum: StatusEnum,
  })
  @AutoMap()
  status: StatusEnum;

  @ApiResponseProperty({
    example: 'true',
  })
  @AutoMap()
  blocked: boolean;
}
