import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

// TODO-GENERATOR: INSERT THE DTO CREATE HERE
// TODO-GENERATOR: PUT THE @ApiProperty() in each property
// TODO-GENERATOR: PUT THE @IsNotEmpty() in each property or @IsOptional() to be recognized in request
export class OrganizationCreateDto {
  @ApiProperty({
    example: 'Organization Name',
    description: 'O nome da sua organização',
  })
  @IsNotEmpty({ message: 'O nome da organização é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'id do usuário',
    description: 'ID do usuário',
  })
  @IsNotEmpty({ message: 'O id do usuario é obrigatorio' })
  userId?: string;
}
