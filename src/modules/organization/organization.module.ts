import { PrismaModule } from '../../database/prisma/prisma.module';
import { OrganizationController } from './organization.controller';
import { OrganizationMapping } from './organization.mapping';
import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationMapping, OrganizationRepository],
  imports: [PrismaModule],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
