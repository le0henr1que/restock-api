import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum, StatusEnum } from '@prisma/client';

export class UserPayload {
  @ApiProperty({
    description: 'Sub da token',
    example: 'dkifja7fa89s7fa9sdf',
  })
  sub: string;

  @ApiProperty({
    description: 'Id do usuário',
    example: 'dkifja7fa89s7fa9sdf',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Admin',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'admin@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Tentativas de logins falhas do usuário',
    example: 2,
  })
  loginAttempts: number;

  @ApiProperty({
    description: 'Roles do usuário',
    enum: [RoleEnum],
  })
  roles: string[];

  @ApiProperty({
    description: 'Permissões do usuário',
    example: [
      {
        assignment: 'USER',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      {
        assignment: 'COMPANY',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    ],
  })
  assignments: {
    assignment: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];

  @ApiProperty({
    description: 'Status do usuário',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty({
    description: 'Bloqueado',
    example: false,
  })
  blocked: boolean;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Data de atualização do usuário',
    example: '2021-01-01T00:00:00.000Z',
  })
  deletedAt?: string | null;

  @ApiProperty({
    description: 'Versão do usuário',
    example: 1,
  })
  version: number;

  @ApiProperty({
    description: 'Id do usuário',
    example: 'dkifja7fa89s7fa9sdf',
  })
  organizationId: string;

  @ApiProperty({
    description: 'Data de criação da token',
    example: '2021-01-01T00:00:00.000Z',
  })
  iat: number;

  @ApiProperty({
    description: 'Data de expiração da token',
    example: '2021-01-01T00:00:00.000Z',
  })
  exp: number;

  @ApiProperty({
    description: 'IP do usuário',
    example: '12.23.542.123.22',
  })
  ip: string;

  // Inserted in the RT Guard
  refreshToken?: string;
}
