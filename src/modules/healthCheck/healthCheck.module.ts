import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma/prisma.module';

import { HealthCheckController } from './healthCheck.controller';

@Module({
  controllers: [HealthCheckController],
  imports: [PrismaModule],
  exports: [HealthCheckModule],
})
export class HealthCheckModule {}
