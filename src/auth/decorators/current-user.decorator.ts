import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest } from '../models/AuthRequest';
import { UserPayload } from '../models/UserPayload';

/**
 * Custom decorator to extract the authenticated user from the request.
 *
 * @param {unknown} data - Additional data passed to the decorator.
 * @param {ExecutionContext} context - The execution context from which to extract the request.
 * @returns {UserPayload | undefined} The authenticated user's payload, or undefined if not authenticated.
 *
 * @description
 * This decorator is used within route handlers to easily access the authenticated user's payload.
 * It extracts the user information from the request object, assuming the request has been processed
 * by authentication middleware that attaches the user payload.
 */
export const AuthenticatedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (request.user && request.user.id) {
      return request.user;
    }
  },
);
