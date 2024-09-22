import { $Enums, Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';

// TODO-GENERATOR: INSERT THE DTO CREATE HERE
// TODO-GENERATOR: PUT THE @ApiProperty() in each property
// TODO-GENERATOR: PUT THE @IsNotEmpty() in each property or @IsOptional() to be recognized in request
export class PlanCreateDto implements Prisma.PlanUncheckedCreateInput {
  name: string;
  price: string | number | Prisma.Decimal | DecimalJsLike;
  durationInDays: number;
  userLimit: number;
}
