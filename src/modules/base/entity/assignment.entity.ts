import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusEnum, Assignment, AssignmentsEnum } from '@prisma/client';

export class AssignmentEntity implements Assignment {
  @ApiProperty({
    description: 'ID of entity',
    example: 'ckk7q8q2o0000yj6q6q7q8q2o',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'Name of the assignment',
    enum: AssignmentsEnum,
  })
  @AutoMap()
  name: AssignmentsEnum;

  @ApiProperty({
    description: 'Status of the assignment',
    enum: AssignmentsEnum,
  })
  @AutoMap()
  status: StatusEnum;

  @ApiProperty({
    description: 'The created date',
    example: '2021-01-01T00:00:00.000Z',
  })
  @AutoMap()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'The deleted date',
    example: '2021-01-01T00:00:00.000Z',
  })
  @AutoMap()
  deletedAt: Date;
}
