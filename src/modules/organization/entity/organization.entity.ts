import { $Enums, Organization } from '@prisma/client';
import { BaseEntity } from 'src/modules/base/base.entity';

// TODO-GENERATOR: IMPLEMENT THE INTERFACE
// TODO-GENERATOR: PUT THE @ApiProperty() in each property
export class OrganizationEntity extends BaseEntity implements Organization {
  ownerId: string;
  name: string;
  planId: string;
}
