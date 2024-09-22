import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserPassword {
  @ApiProperty({
    description: 'Versão do usuário',
    example: 3,
  })
  @IsNumber({}, { message: 'O campo de versão deve ser um número' })
  @IsNotEmpty({ message: 'A versão é obrigatória' })
  version: number;

  @ApiProperty({
    description: 'Senha atual do usuário',
    example: '123456',
  })
  @IsNotEmpty({ message: 'A senha atual é obrigatória' })
  @IsString({ message: 'O campo password deve ser uma string' })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  actualPassword: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: '123456',
  })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @IsString({ message: 'O campo de senha deve ser uma string' })
  @MaxLength(255, {
    message: 'O campo password deve ter menos de 255 caracteres',
  })
  @MinLength(3, {
    message: 'O campo password deve ter mais de 3 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W|_)[\S]{8,}$/, {
    message:
      'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  newPassword: string;
}
