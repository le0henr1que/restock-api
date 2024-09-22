import { AutoMap } from '@automapper/classes';
import { ApiResponseProperty } from '@nestjs/swagger';

class RoleDto {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;
}

class AssignmentUserDto {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiResponseProperty({
    type: Boolean,
  })
  create: boolean;

  @ApiResponseProperty({
    type: Boolean,
  })
  read: boolean;

  @ApiResponseProperty({
    type: Boolean,
  })
  update: boolean;

  @ApiResponseProperty({
    type: Boolean,
  })
  delete: boolean;
}

export class UserResponseDto {
  @AutoMap()
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @AutoMap()
  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @AutoMap()
  @ApiResponseProperty({
    type: String,
  })
  email: string;

  @AutoMap()
  @ApiResponseProperty({
    type: RoleDto,
  })
  role: RoleDto;

  @AutoMap()
  @ApiResponseProperty({
    type: [AssignmentUserDto],
  })
  assignments: AssignmentUserDto[];

  @AutoMap()
  @ApiResponseProperty({
    type: String,
  })
  createdAt: Date | string;

  @AutoMap()
  @ApiResponseProperty({
    type: String,
  })
  updatedAt: Date;

  @AutoMap()
  @ApiResponseProperty({
    type: String,
  })
  status: string;

  @AutoMap()
  @ApiResponseProperty({
    type: Number,
  })
  version: number;
}
