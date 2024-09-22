import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseEntity {
  @ApiResponseProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @AutoMap()
  id: string;

  @ApiResponseProperty({
    example: 1,
  })
  @AutoMap()
  version: number;

  @ApiResponseProperty({
    example: '03/11/2024',
  })
  @AutoMap()
  createdAt: Date | any;

  @ApiResponseProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @AutoMap()
  updatedAt: Date;

  @ApiResponseProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @AutoMap()
  deletedAt: Date;

  @ApiProperty({
    description: 'Status do registro',
    example: 'Ativo',
  })
  @IsNotEmpty({
    message: 'O status é obrigatório',
  })
  @AutoMap()
  status: any;
}

export const BaseEntitySelect = {
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  status: true,
};
