import {
  createMap,
  forMember,
  extend,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';

import { RoleDto } from './dto/response/assignments.dto';
import { UserResponseDto } from './dto/response/user.dto';
import { UserPaginationResponse } from './dto/response/user.pagination.response';
import { UserDto } from './dto/type/user.dto';
import { TUserPagination } from './dto/type/user.pagination';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserMapping extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      const baseMapper = createMap(
        mapper,
        UserEntity,
        UserDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom(
            (source) =>
              source?.createdAt && format(source?.createdAt, 'dd/MM/yyyy'),
          ),
        ),
        forMember(
          (destination) => destination.role,
          mapFrom((source) => {
            return source?.Roles[0]?.Role?.name;
          }),
        ),
      );

      createMap(
        mapper,
        TUserPagination,
        UserPaginationResponse,
        extend(baseMapper),
      );

      createMap(mapper, RoleDto, RoleDto);

      createMap(
        mapper,
        UserEntity,
        UserResponseDto,
        forMember(
          (destination) => destination.createdAt,
          mapFrom(
            (source) =>
              source?.createdAt && format(source?.createdAt, 'dd/MM/yyyy'),
          ),
        ),
        forMember(
          (destination) => destination.role,
          mapFrom((source) => {
            return {
              id: source?.Roles[0]?.Role?.id,
              name: source?.Roles[0]?.Role?.name,
            };
          }),
        ),
        forMember(
          (destination) => destination.assignments,
          mapFrom((source) =>
            source?.UserAssignment?.map((assignment) => {
              return {
                id: assignment?.Assignment?.id,
                name: assignment?.Assignment?.name,
                create: assignment?.create,
                read: assignment?.read,
                update: assignment?.update,
                delete: assignment?.delete,
              };
            }),
          ),
        ),
      );
    };
  }
}
