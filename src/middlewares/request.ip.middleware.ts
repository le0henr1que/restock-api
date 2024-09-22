import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { MessagesHelperKey, getMessage } from 'src/helpers/messages.helper';
import {
  deactivateRequiredIpsInRequest,
  enabledMultipleLogin,
  isTestEnviroment,
} from 'src/utils/environment';
import { getIpAddress, getLanguage } from 'src/utils/get-ip-address';

import { AuditLogRequestInformation } from './interface/logger';

/**
 * Middleware for handling IP-related validations for requests.
 *
 * @description
 * This middleware checks the request's IP address and performs validations
 * related to user authentication and IP restrictions. It utilizes AuthService
 * for IP validation logic and responds accordingly if the validation fails.
 */
@Injectable()
export class RequestIpMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  /**
   * Middleware function to validate the request IP.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {Response} res - The outgoing HTTP response.
   * @param {NextFunction} next - The next function in the middleware chain.
   *
   * @returns {Promise<void | Response<any, Record<string, any>>>} A promise that resolves when the middleware logic is completed.
   *
   * @description
   * This method checks the request for a valid IP address and token. If IP validation
   * is required and the IP is not valid, it sends an appropriate response. Otherwise,
   * it proceeds with the next middleware in the chain. The method handles multiple login
   * scenarios and bypasses IP validation in test environments or when multiple logins are enabled.
   */
  async use(
    request: {
      headers: { [x: string]: any; authorization: string };
      url: string;
      method: string;
    },
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any, Record<string, any>>> {
    const token = request?.headers?.authorization
      ?.replace(/bearer\s+/i, '')
      .trim();
    if (
      token == 'null' ||
      token == null ||
      token == '' ||
      deactivateRequiredIpsInRequest() ||
      isTestEnviroment()
    ) {
      return next();
    }

    const languagePreference = getLanguage(request?.headers['accept-language']);

    try {
      const requestInformation = new AuditLogRequestInformation(
        getIpAddress(request?.headers['x-forwarded-for']),
        request.url,
        request.method,
      );

      if (requestInformation?.ip == null) {
        return res.status(401).json({
          message: getMessage(
            MessagesHelperKey.IP_REQUESTER_NOT_FOUND,
            languagePreference,
          ),
        });
      }

      if (enabledMultipleLogin()) {
        return next();
      }

      await this.authService.validateIpRequest(
        token,
        requestInformation,
        languagePreference,
      );
      next();
    } catch (err) {
      res.status(419).json({
        message: getMessage(
          MessagesHelperKey.MULTIPLE_LOGIN_MESSAGE,
          languagePreference,
        ),
      });
    }
  }
}
