import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserRestrictionBody {
  @ApiProperty({
    description: 'id do usuário a ser bloqueado',
    example: 'dkif-ja7fa-89s7f-a9sdf',
  })
  @IsNotEmpty({ message: 'O campo de id de usuário deve ser preenchido' })
  @Type(() => String)
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' && value?.trim(),
  )
  id: string;

  @ApiProperty({
    description: 'Versão do usuário',
    example: 4,
  })
  @IsNotEmpty({ message: 'A versão do usuário deve ser enviada' })
  @IsNumber({}, { message: 'A versão do usuário deve ser um número' })
  @Type(() => Number)
  version: number;
}
