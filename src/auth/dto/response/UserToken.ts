import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserToken {
  @ApiProperty({
    description: 'Token de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @AutoMap()
  accessToken: string;

  @ApiProperty({
    description: 'Token de atualização',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkJDISY73IkpXVCJ9',
  })
  @AutoMap()
  refreshToken: string;
}

export class UserRegisteredResponse {
  @ApiProperty({
    description: 'Id do usuário',
    example: 'dkifja7fa89s7fa9sdf',
  })
  @AutoMap()
  id: string;
}
