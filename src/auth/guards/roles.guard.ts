import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@prisma/client';
import { MessagesHelperKey, getMessage } from 'src/helpers/messages.helper';
import { getLanguage } from 'src/utils/get-ip-address';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRequest } from '../models/AuthRequest';

/**
 * Authorization guard for user roles.
 *
 * @implements {CanActivate}
 *
 * @description
 * This guard is used to check if a user has the required roles to access a protected route.
 * It retrieves the required roles from the 'ROLES_KEY' metadata and compares them with the
 * roles of the authenticated user. If the user has the required roles, access is granted;
 * otherwise, access is denied.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly _logger = new Logger('Roles.Guard');

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest<AuthRequest>().user;

    if (user.roles.some((role) => role === RoleEnum.ADMIN)) {
      return true;
    }

    const hasAllRolesNeeded = user.roles.some((userRole) =>
      requiredRoles.some((requiredRole) => requiredRole == userRole),
    );

    const message = hasAllRolesNeeded ? 'has' : 'has no';

    const url = context.switchToHttp().getRequest<AuthRequest>().url;
    this._logger.log(`User ${user.email} ${message} permission to ${url}`);

    const request = context?.switchToHttp()?.getRequest();
    const languagePreference = getLanguage(
      request && request.headers && request.headers['accept-language'],
    );

    if (!hasAllRolesNeeded) {
      throw new ForbiddenException(
        getMessage(
          MessagesHelperKey.NOT_AUTHORIZED_RESOURCE,
          languagePreference,
        ),
      );
    }

    return hasAllRolesNeeded;
  }
}
