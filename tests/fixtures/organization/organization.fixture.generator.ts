import { faker } from '@faker-js/faker';
import { CrudType } from 'src/modules/base/interfaces/ICrudTypeMap';
import { OrganizationCreateDto } from 'src/modules/organization/dto/request/organization.create.dto';
import { OrganizationUpdateDto } from 'src/modules/organization/dto/request/organization.update.dto';
import { OrganizationTypeMap } from 'src/modules/organization/entity/organization.type.map';

// TODO-GENERATOR: IMPLEMENT THE INTERFACE AND THE MOCK VALUES
/**
 * Generates a create input object for database
 *
 * @returns {OrganizationTypeMap[CrudType.CREATE_UNCHECKED]} The generated create input object.
 */
export const generateCreateInput =
  (): OrganizationTypeMap[CrudType.CREATE_UNCHECKED] => {
    const createInput: OrganizationCreateDto = {
      name: '',
    };

    return createInput;
  };

// TODO-GENERATOR: IMPLEMENT THE MOCK VALUES
/**
 * Generates an update input object for database
 *
 * @returns {OrganizationTypeMap[CrudType.UPDATE]} The generated update input object.
 */
export const generateUpdateInput = (): OrganizationTypeMap[CrudType.UPDATE] => {
  const updateInput: OrganizationUpdateDto = {
    version: 1,
  };

  return updateInput;
};

/**
 * Generates a partial entity and removes specified fields.
 *
 * @param {string[]} removeFields - An array of field names to remove from the entity.
 * @returns The generated partial entity.
 */
export const generatePartialEntity = (removeFields: string[] = []) => {
  const entity = generateCreateInput();
  removeFields.forEach((field) => {
    delete entity[field];
  });

  return entity;
};
