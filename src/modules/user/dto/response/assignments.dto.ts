import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@prisma/client';

export class AssignmentsDto {
  @ApiProperty({
    description: 'Id da permissão',
    example: 'dkifja7fa89s7fa9sdf',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'Nome da permissão',
    example: 'Usuario',
  })
  @AutoMap()
  name: string;
}

export class RoleDto {
  @ApiProperty({
    description: 'Id da role',
    example: 'dkifja7fa89s7fa9sdf',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'Nome da role',
    enum: RoleEnum,
  })
  @AutoMap()
  name: string;
}
