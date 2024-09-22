import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator to specify roles required for a route handler.
 *
 * @param {...RoleEnum[]} roles - The roles required to access the route.
 * @returns {Decorator} A decorator function.
 *
 * @description
 * This decorator is used to define role-based access control on a route handler.
 * It specifies the roles that are allowed to access the route. It utilizes NestJS's
 * SetMetadata to attach roles metadata to the route handler.
 */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
