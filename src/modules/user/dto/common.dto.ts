import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AssignmentDto {
  @ApiProperty({
    description: 'ID do assignment',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'O campo assignmentId deve ser preenchido' })
  @AutoMap()
  assignmentId: string;

  @ApiProperty({
    description: 'Permissionamento do assignment',
    example: true,
  })
  @IsNotEmpty({ message: 'O campo create deve ser preenchido' })
  @AutoMap()
  create: boolean;

  @ApiProperty({
    description: 'Permissionamento do assignment',
    example: true,
  })
  @IsNotEmpty({ message: 'O campo read deve ser preenchido' })
  @AutoMap()
  read: boolean;

  @ApiProperty({
    description: 'Permissionamento do assignment',
    example: true,
  })
  @IsNotEmpty({ message: 'O campo update deve ser preenchido' })
  @AutoMap()
  update: boolean;

  @ApiProperty({
    description: 'Permissionamento do assignment',
    example: false,
  })
  @IsNotEmpty({ message: 'O campo delete deve ser preenchido' })
  @AutoMap()
  delete: boolean;
}
