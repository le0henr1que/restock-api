import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class ChangePasswordByRecovery {
  @IsNotEmpty({
    message: 'A nova senha é obrigatória',
  })
  @MaxLength(255, {
    message: 'A nova senha deve ter no máximo 255 caracteres',
  })
  @ApiProperty({
    description: 'Nova senha',
    example: '123456',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    },
  )
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  newPassword: string;

  @IsNotEmpty({
    message: 'O token de acesso é obrigatório',
  })
  @ApiProperty({
    description: 'Token de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjI',
  })
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  accessToken: string;
}
