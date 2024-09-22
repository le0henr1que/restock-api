import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { RoleEntity } from '../../base/entity/role.entity';

export class UserRoleEntity implements UserRole {
  organizationUserId: string;
  organizationId: string;
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the user role',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the user',
  })
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the role',
  })
  roleId: string;

  @ApiProperty({ type: RoleEntity })
  @AutoMap(() => RoleEntity)
  Role?: RoleEntity;
}
