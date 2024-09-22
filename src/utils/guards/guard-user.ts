import { NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  MessagesHelperKey,
  getMessage,
  setMessage,
} from 'src/helpers/messages.helper';
import { UserEntity } from 'src/modules/user/entity/user.entity';

import { Languages } from '../language-preference';

/**
 * Ensures that the given user is valid and not blocked or inactive. If the user is not valid, appropriate exceptions are thrown.
 *
 * @param user - The user entity to be validated.
 * @param {Logger} logger - The logging service to log debug messages.
 * @param {Languages} languagePreference - The language preference of the user
 * @param {Object} [optionals] - Optional parameters.
 * @param {string} [optionals.identifierRequest] - Optional identifier for the request, used in logging. If not provided, a random UUID is generated.
 * @throws {NotFoundException} - Thrown if the user is not found.
 * @throws {ForbiddenException} - Thrown if the user is blocked or inactive.
 */
export const guardUser = (
  user: {
    email: string;
    blocked: boolean;
    status: StatusEnum;
    deletedAt: Date | null;
  },
  logger: Logger,
  languagePreference: Languages,
  optionals?: {
    identifierRequest?: string;
    requestUserEmail?: string;
  },
) => {
  const identifierRequest = optionals?.identifierRequest ?? randomUUID();

  if (!user || Object.values(user).every((value) => value === undefined)) {
    logger.debug(`${identifierRequest} User not found`);
    throw new NotFoundException(
      setMessage(
        getMessage(MessagesHelperKey.USER_NOT_FOUND, languagePreference),
        user?.email ?? optionals?.requestUserEmail,
      ),
    );
  }

  if (user?.blocked) {
    logger.debug(`${identifierRequest} User blocked`);
    throw new ForbiddenException(
      setMessage(
        getMessage(MessagesHelperKey.USER_BLOCKED_MESSAGE, languagePreference),
        user?.email,
      ),
    );
  }

  if (user?.status === StatusEnum.INACTIVE || user?.deletedAt != null) {
    logger.debug(`${identifierRequest} User inactivated`);
    throw new ForbiddenException(
      setMessage(
        getMessage(
          MessagesHelperKey.USER_INACTIVE_TRYING_ACCESS,
          languagePreference,
        ),
        user?.email,
      ),
    );
  }
};
