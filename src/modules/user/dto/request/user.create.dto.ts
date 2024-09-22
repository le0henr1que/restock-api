import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  isEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { AssignmentDto } from '../common.dto';
import { ConfirmType } from 'src/utils/constants';

export class UserCreateDto {
  @ApiProperty({
    example: 'emailusuario@gmail.com',
    description: 'E-mail do usuário',
  })
  @IsNotEmpty({ message: 'O campo de email deve ser preenchido' })
  @IsEmail({}, { message: 'O campo de email deve ser um e-mail válido' })
  @MaxLength(200, {
    message: 'O campo de email deve ter menos de 200 caracteres',
  })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim() && value?.toLowerCase(),
  )
  email: string;

  @ApiProperty({
    example: 'Leonardo Silva',
    description: 'Nome do usuário',
  })
  @IsNotEmpty({ message: 'O campo de nome deve ser preenchido' })
  @IsString({ message: 'O campo de nome deve ser uma string' })
  @MaxLength(200, {
    message: 'O campo de nome deve ter menos de 200 caracteres',
  })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  name: string;

  @ApiProperty({
    description: 'ID da Role',
    example: ['123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsNotEmpty({ message: 'O campo de função deve ser preenchido' })
  @IsArray({ message: 'O campo função deve ser um array' })
  @ArrayMinSize(1, {
    message: 'O campo função deve ter no mínimo 1 item',
  })
  @IsOptional()
  rolesIds: string[];

  @ApiProperty({
    description: 'Dados do assignment',
    type: [AssignmentDto],
  })
  @IsArray({ message: 'O campo de permissionamento deve ser um array' })
  @ArrayMinSize(1, {
    message: 'O campo de permissionamento deve ter no mínimo 1 item',
  })
  @ValidateNested({ each: true })
  @Type(() => AssignmentDto)
  @IsOptional()
  assignments: AssignmentDto[];

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
  image?: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    example: '123456',
    description: 'Id da organização',
  })
  @IsOptional()
  organizationId: string;
}
