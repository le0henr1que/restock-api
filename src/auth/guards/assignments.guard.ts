import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AssignmentsEnum, RoleEnum } from '@prisma/client';
import { MessagesHelperKey, getMessage } from 'src/helpers/messages.helper';
import { AssignmentPermission } from 'src/utils/constants';
import { getLanguage } from 'src/utils/get-ip-address';

import {
  ASSIGNMENTS_KEY,
  AssignmentOptions,
} from '../decorators/assignments.decorator';
import { AuthRequest } from '../models/AuthRequest';

/**
 * Guard responsible for verifying if a user has the necessary assignments and permissions.
 */
@Injectable()
export class AssignmentsGuard implements CanActivate {
  private readonly _logger = new Logger('Assignments.Guard');

  constructor(private reflector: Reflector) {}

  /**
   * Method to activate the guard and check if the user has the necessary assignments and permissions.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {boolean} Returns true if the user is authorized.
   * @throws {ForbiddenException} If the user is not authorized.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredAssignments =
      this.reflector.getAllAndOverride<AssignmentOptions>(ASSIGNMENTS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    const request = context?.switchToHttp()?.getRequest();
    const languagePreference = getLanguage(
      request && request.headers && request.headers['accept-language'],
    );

    if (
      !requiredAssignments ||
      requiredAssignments.assignments.length === 0 ||
      requiredAssignments.permissions.length === 0
    ) {
      // Need to have at least one assignment and one permission
      return true;
    }

    const user = context.switchToHttp().getRequest<AuthRequest>().user;

    if (user.roles.some((role) => role === RoleEnum.ADMIN)) {
      return true;
    }

    /**
     * Verifica se um usuário possui todas as permissões necessárias.
     * @param {Object} userPermission - O objeto contendo as permissões do usuário.
     * @param {boolean} userPermission.create - Se o usuário tem permissão para criar.
     * @param {boolean} userPermission.read - Se o usuário tem permissão para ler.
     * @param {boolean} userPermission.update - Se o usuário tem permissão para atualizar.
     * @param {boolean} userPermission.delete - Se o usuário tem permissão para deletar.
     * @param {string[]} requiredPermissions - Array de permissões necessárias.
     * @returns {boolean} Retorna true se o usuário possui todas as permissões necessárias.
     */
    const checkUserHasAllPermissions = (
      userPermission: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      },
      requiredPermissions: string[],
    ): boolean => {
      return requiredPermissions.every((requiredPermission) =>
        checkUserHasAnyPermission(userPermission, requiredPermission),
      );
    };

    /**
     * Verifica se um usuário possui uma permissão específica.
     * @param {Object} userPermission - O objeto contendo as permissões do usuário.
     * @param {boolean} userPermission.create - Se o usuário tem permissão para criar.
     * @param {boolean} userPermission.read - Se o usuário tem permissão para ler.
     * @param {boolean} userPermission.update - Se o usuário tem permissão para atualizar.
     * @param {boolean} userPermission.delete - Se o usuário tem permissão para deletar.
     * @param {string} requiredPermission - A permissão necessária.
     * @returns {boolean} Retorna true se o usuário possui a permissão específica.
     */
    const checkUserHasAnyPermission = (
      userPermission: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      },
      requiredPermission: string,
    ): boolean => {
      switch (requiredPermission) {
        case AssignmentPermission.CREATE:
          return userPermission.create;
        case AssignmentPermission.READ:
          return userPermission.read;
        case AssignmentPermission.UPDATE:
          return userPermission.update;
        case AssignmentPermission.DELETE:
          return userPermission.delete;
        default:
          return false;
      }
    };

    /**
     * Verifica se um usuário atende aos requisitos de atribuição para um recurso específico.
     * @param {Object} userAssignment - O objeto contendo a atribuição e permissões do usuário.
     * @param {string} userAssignment.assignment - A atribuição do usuário.
     * @param {boolean} userAssignment.create - Se o usuário tem permissão para criar.
     * @param {boolean} userAssignment.read - Se o usuário tem permissão para ler.
     * @param {boolean} userAssignment.update - Se o usuário tem permissão para atualizar.
     * @param {boolean} userAssignment.delete - Se o usuário tem permissão para deletar.
     * @param {AssignmentsEnum} requiredAssignment - A atribuição necessária.
     * @returns {boolean} Retorna true se o usuário atende aos requisitos da atribuição.
     */
    const checkUserMeetsAssignmentRequirements = (
      userAssignment: {
        assignment: string;
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      },
      requiredAssignment: AssignmentsEnum,
    ): boolean => {
      return (
        userAssignment.assignment === requiredAssignment &&
        (requiredAssignments.requireAllPermissions
          ? checkUserHasAllPermissions(
              userAssignment,
              requiredAssignments.permissions,
            )
          : requiredAssignments.permissions.some((requiredPermission) =>
              checkUserHasAnyPermission(userAssignment, requiredPermission),
            ))
      );
    };

    /**
     * Verifica se um usuário tem permissão para qualquer atribuição necessária.
     * @param {AssignmentsEnum} requiredAssignment - A atribuição necessária.
     * @returns {boolean} Retorna true se o usuário tem permissão para a atribuição necessária.
     */
    const checkUserHasPermissionForAnyAssignment = (
      requiredAssignment: AssignmentsEnum,
    ): boolean => {
      return user.assignments.some((userAssignment) =>
        checkUserMeetsAssignmentRequirements(
          userAssignment,
          requiredAssignment,
        ),
      );
    };

    const userAuthorized: boolean = requiredAssignments.assignments.some(
      checkUserHasPermissionForAnyAssignment,
    );
    const message = userAuthorized ? 'has' : 'has no';

    const url = context.switchToHttp().getRequest<AuthRequest>().url;
    this._logger.log(`User ${user.email} ${message} permission to ${url}`);

    if (!userAuthorized) {
      throw new ForbiddenException(
        getMessage(
          MessagesHelperKey.NOT_AUTHORIZED_RESOURCE,
          languagePreference,
        ),
      );
    }

    return userAuthorized;
  }
}
