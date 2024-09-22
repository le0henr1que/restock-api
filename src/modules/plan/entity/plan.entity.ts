import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Plan } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/modules/base/base.entity';

// TODO-GENERATOR: IMPLEMENT THE INTERFACE
// TODO-GENERATOR: PUT THE @ApiProperty() in each property
export class PlanEntity extends BaseEntity implements Plan {
  description: string;
  popular: boolean;
  buttonText: string;
  benefitList: string[];
  planIdPlatform: string;
  @ApiProperty({
    example: 'Plan Name',
    description: 'O nome do plano',
  })
  @IsNotEmpty({ message: 'O nome do plano é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'Plan Description',
    description: 'A descrição do plano',
  })
  @IsNotEmpty({ message: 'A descrição do plano é obrigatória' })
  price: Decimal;

  @ApiProperty({
    example: 30,
    description: 'A duração do plano em dias',
  })
  @IsNotEmpty({ message: 'A duração do plano é obrigatória' })
  durationInDays: number;

  @ApiProperty({
    example: 10,
    description: 'O limite de usuários do plano',
  })
  @IsNotEmpty({ message: 'O limite de usuários do plano é obrigatório' })
  userLimit: number;
}
