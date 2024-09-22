import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/base.entity';

import { AssignmentsDto } from '../response/assignments.dto';

export class UserDto extends BaseEntity {
  @AutoMap()
  role: string;

  @AutoMap()
  assignments: AssignmentsDto[];
}
