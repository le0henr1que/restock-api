import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { OrganizationDto } from './dto/response/organization.dto';
import { OrganizationEntity } from './entity/organization.entity';

@Injectable()
export class OrganizationMapping extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      const baseMapper = createMap(
        mapper,
        OrganizationEntity,
        OrganizationDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
      );
    };
  }
}
