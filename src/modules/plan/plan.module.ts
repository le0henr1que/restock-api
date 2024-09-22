import { PrismaModule } from '../../database/prisma/prisma.module';
import { PlanController } from './plan.controller';
import { PlanMapping } from './plan.mapping';
import { PlanRepository } from './plan.repository';
import { PlanService } from './plan.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PlanController],
  providers: [PlanService, PlanMapping, PlanRepository],
  imports: [PrismaModule],
  exports: [PlanService, PlanRepository],
})
export class PlanModule {}
