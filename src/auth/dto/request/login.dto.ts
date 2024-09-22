import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'admin@gmail.com',
    default: 'admin@gmail.com',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim() && value?.toLowerCase(),
  )
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'admin',
    default: 'admin',
  })
  @IsNotEmpty({ message: 'Password é obrigatório' })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  password: string;
}
