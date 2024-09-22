import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class verifyAccountCreateDtos {
  @ApiProperty({
    example: '32131dsadd-dsalkdajsk12-2131',
    description: 'ID do usuário',
  })
  @IsNotEmpty({ message: 'O campo de email deve ser preenchido' })
  userId?: string;

  @ApiProperty({
    example: '32131dsadd-dsalkdajsk12-2131',
    description: 'ID do usuário',
  })
  @IsOptional()
  token?: string;
}
