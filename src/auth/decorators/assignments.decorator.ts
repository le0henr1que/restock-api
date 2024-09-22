import { SetMetadata } from '@nestjs/common';
import { AssignmentsEnum } from '@prisma/client';
export const ASSIGNMENTS_KEY = 'assignments';

/**
 * Interface representing the options for assignments used in access control.
 * @interface
 * @property {AssignmentsEnum[]} assignments - An array of assignment enums.
 * @property {string[]} permissions - An array of required permissions.
 * @property {boolean} [requireAllPermissions] - An optional flag indicating whether all listed permissions are required.
 */
export interface AssignmentOptions {
  assignments: AssignmentsEnum[];
  permissions: string[];
  requireAllPermissions?: boolean;
}

/**
 * A decorator to define assignment options and permissions for a resource or method.
 * @param {AssignmentOptions} options - The assignment and permission options.
 * @returns A decorator that applies the specified options.
 */
export const Assignments = (options: AssignmentOptions) =>
  SetMetadata(ASSIGNMENTS_KEY, options);
