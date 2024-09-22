import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, RoleEnum, StatusEnum } from '@prisma/client';

export class RoleEntity implements Role {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier for the role',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    enum: RoleEnum,
    description: 'The name of the role',
  })
  @AutoMap()
  name: RoleEnum;

  @ApiProperty({
    enum: StatusEnum,
    description: 'The status of the role',
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
