import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Custom decorator to mark a route handler as publicly accessible.
 *
 * @returns {Decorator} A decorator function.
 *
 * @description
 * This decorator is used to mark a specific route handler as public, meaning it does not require
 * authentication. It utilizes NestJS's SetMetadata to attach metadata to the route handler.
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
