import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssignmentsEnum, StatusEnum, User } from '@prisma/client';
import { BaseEntity } from 'src/modules/base/base.entity';

import { Media } from '../../base/entity/media.entity';
import { UserAssignmentEntity } from './user.assignment.entity';
import { UserRoleEntity } from './user.role.entity';

export class UserEntity extends BaseEntity implements User {
  hasCompletedCheckout: boolean;
  isEmailVerified: boolean;
  emailVerificationToken: string;
  organizationId?: any;
  organizationUser: any;
  ownedOrganizations: any;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @AutoMap()
  isAdmin: boolean;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @AutoMap()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @AutoMap()
  email: string;

  password: string;

  @ApiProperty({
    example: 0,
    description: 'Number of attempted logins',
  })
  @AutoMap()
  loginAttempts: number;

  @ApiProperty({
    type: () => [UserRoleEntity],
  })
  @AutoMap(() => UserRoleEntity)
  Roles?: UserRoleEntity[];

  @ApiProperty({
    example: 'active',
    description: 'Account status',
    enum: StatusEnum,
  })
  @AutoMap()
  status: StatusEnum;

  @ApiProperty({
    example: false,
    description: 'Whether the user is blocked',
  })
  @AutoMap()
  blocked: boolean;

  @ApiPropertyOptional({
    example: '192.168.1.1',
    description: 'IP address of the user',
  })
  @AutoMap()
  ip: string;

  @ApiPropertyOptional({
    example: 'sometoken',
    description: 'Refresh token for the user',
  })
  @AutoMap()
  refreshToken: string;

  @ApiPropertyOptional({
    example: 'sometoken',
    description: 'Recovery token for email reset',
  })
  @AutoMap()
  recoveryToken: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'The unique identifier for the related media',
  })
  @AutoMap()
  mediaId: string;

  @ApiPropertyOptional({
    description: 'Related media content',
    type: () => Media,
  })
  @AutoMap(() => Media)
  Media?: Media;

  @ApiPropertyOptional({
    description: 'Related Assignments',
    type: () => [UserAssignmentEntity],
  })
  @AutoMap(() => UserAssignmentEntity)
  UserAssignment?: UserAssignmentEntity[];
}
