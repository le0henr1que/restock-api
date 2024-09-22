import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { MessagesHelperKey, getMessage } from 'src/helpers/messages.helper';
import { enabledMultipleLogin, isTestEnviroment } from 'src/utils/environment';
import { getIpAddress, getLanguage } from 'src/utils/get-ip-address';

import { AuditLogRequestInformation } from './interface/logger';

/**
 * Middleware for handling validations related to disabled users.
 *
 * @description
 * This middleware checks if the user associated with the request is disabled.
 * It utilizes AuthService for user validation logic and responds with an
 * appropriate message if the user is disabled. This middleware ensures that
 * requests from disabled users are not processed further in the application.
 */
@Injectable()
export class UserDisabledMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  /**
   * Middleware function to validate if the user is disabled.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {Response} res - The outgoing HTTP response.
   * @param {NextFunction} next - The next function in the middleware chain.
   *
   * @returns {Promise<void>} A promise that resolves when the middleware logic is completed.
   *
   * @description
   * This method extracts the JWT token from the request, decodes it, and checks
   * if the user is disabled. If the user is disabled, it sends a 403 Forbidden response.
   * In cases where IP validation is not required (e.g., test environments or multiple
   * login scenarios), the check is bypassed. Otherwise, it proceeds with the next middleware.
   */
  async use(
    request: {
      headers: { [x: string]: any; authorization: string };
      url: string;
      method: string;
    },
    res: Response,
    next: NextFunction,
  ) {
    const token = request?.headers?.authorization
      ?.replace(/bearer\s+/i, '')
      .trim();

    if (token == 'null' || token == null || token == '') {
      return next();
    }

    const requestInformation = new AuditLogRequestInformation(
      getIpAddress(request?.headers['x-forwarded-for']),
      request.url,
      request.method,
    );

    const languagePreference = getLanguage(request?.headers['accept-language']);
    if (
      requestInformation?.ip == null &&
      !isTestEnviroment() &&
      !enabledMultipleLogin()
    ) {
      return res.status(403).json({
        message: getMessage(
          MessagesHelperKey.IP_REQUESTER_NOT_FOUND,
          languagePreference,
        ),
      });
    }

    await this.authService.validateDisabledUserMiddleware(
      token,
      requestInformation,
      languagePreference,
    );

    next();
  }
}
