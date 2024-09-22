import { faker } from '@faker-js/faker';
import { CrudType } from 'src/modules/base/interfaces/ICrudTypeMap';
import { PlanCreateDto } from 'src/modules/plan/dto/request/plan.create.dto';
import { PlanUpdateDto } from 'src/modules/plan/dto/request/plan.update.dto';
import { PlanTypeMap } from 'src/modules/plan/entity/plan.type.map';

// TODO-GENERATOR: IMPLEMENT THE INTERFACE AND THE MOCK VALUES
/**
 * Generates a create input object for database
 *
 * @returns {PlanTypeMap[CrudType.CREATE_UNCHECKED]} The generated create input object.
 */
export const generateCreateInput =
  (): PlanTypeMap[CrudType.CREATE_UNCHECKED] => {
    const createInput: PlanCreateDto = {
      name: '',
      price: 1,
      durationInDays: 1,
      userLimit: 1,
    };

    return createInput;
  };

// TODO-GENERATOR: IMPLEMENT THE MOCK VALUES
/**
 * Generates an update input object for database
 *
 * @returns {PlanTypeMap[CrudType.UPDATE]} The generated update input object.
 */
export const generateUpdateInput = (): PlanTypeMap[CrudType.UPDATE] => {
  const updateInput: PlanUpdateDto = {
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
