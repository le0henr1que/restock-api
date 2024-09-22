import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAssignment } from '@prisma/client';

import { AssignmentEntity } from '../../base/entity/assignment.entity';

export class UserAssignmentEntity implements UserAssignment {
  organizationUserId: string;
  organizationId: string;
  @ApiProperty({
    description: 'ID of entity',
    example: 'ckk7q8q2o0000yj6q6q7q8q2o',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'ID of the user assignment',
    example: 'ckk7q8q2o0000yj6q6q7q8q2o',
  })
  @AutoMap()
  userId: string;

  @ApiProperty({
    description: 'ID of the assignment',
    example: 'ckk7q8q2o0000yj6q6q7q8q2o',
  })
  @AutoMap()
  assignmentsId: string;

  @ApiProperty({
    description: 'Assignment entity',
    type: () => AssignmentEntity,
  })
  @AutoMap(() => AssignmentEntity)
  Assignment?: AssignmentEntity;

  @ApiProperty({
    description: 'Has permission to create',
    example: true,
  })
  @AutoMap()
  create: boolean;

  @ApiProperty({
    description: 'Has permission to read',
    example: true,
  })
  @AutoMap()
  read: boolean;

  @ApiProperty({
    description: 'Has permission to update',
    example: true,
  })
  @AutoMap()
  update: boolean;

  @ApiProperty({
    description: 'Has permission to delete',
    example: false,
  })
  @AutoMap()
  delete: boolean;
}
