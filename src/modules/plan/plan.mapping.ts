import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { PlanDto } from './dto/response/plan.dto';
import { PlanEntity } from './entity/plan.entity';

@Injectable()
export class PlanMapping extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      const baseMapper = createMap(
        mapper,
        PlanEntity,
        PlanDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
      );
    };
  }
}
