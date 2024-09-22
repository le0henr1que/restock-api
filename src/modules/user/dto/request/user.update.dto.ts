import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { AssignmentDto } from '../common.dto';

export class UserUpdateDto {
  @ApiProperty({
    description: 'Versão do usuário',
    example: 3,
  })
  @IsNumber({}, { message: 'O campo de versão deve ser um número' })
  @IsNotEmpty({ message: 'A versão é obrigatória' })
  version: number;

  @ApiPropertyOptional({
    example: 'Leonardo Silva',
    description: 'Nome do usuário',
  })
  @IsOptional()
  @IsString({ message: 'O campo de nome deve ser uma string' })
  @MaxLength(200, {
    message: 'O campo de nome deve ter menos de 200 caracteres',
  })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  name?: string;

  @ApiPropertyOptional({
    example: 'emailusuario@gmail.com',
    description: 'E-mail do usuário',
  })
  @IsOptional()
  @IsEmail({}, { message: 'O campo de email deve ser um e-mail válido' })
  @MaxLength(200, {
    message: 'O campo de email deve ter menos de 200 caracteres',
  })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim() && value?.toLowerCase(),
  )
  email?: string;

  @ApiPropertyOptional({
    example: 'Imagem do usuário',
    description: 'www.google.com.br',
  })
  @IsOptional()
  @IsString({ message: 'O campo de imagem deve ser uma string' })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  mediaUrl?: string;

  @ApiPropertyOptional({
    description: 'ID da Role',
    example: ['123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'O campo de função deve ser um array' })
  @ArrayMinSize(1, { message: 'O campo de função deve ter no mínimo 1 item' })
  rolesIds: string[];

  @ApiPropertyOptional({
    description: 'Dados do assignment',
    type: [AssignmentDto],
  })
  @IsArray({ message: 'O campo de permissionamento deve ser um array' })
  @IsOptional()
  @ArrayMinSize(1, {
    message: 'O campo de permissionamento deve ter no mínimo 1 item',
  })
  @Type(() => AssignmentDto)
  @ValidateNested({ each: true })
  assignments: AssignmentDto[];

  @ApiPropertyOptional({
    description: 'Dados do assignment',
    type: [AssignmentDto],
  })
  @IsOptional()
  userCode?: string;
}
