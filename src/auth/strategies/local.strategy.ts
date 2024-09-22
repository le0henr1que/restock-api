import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuditLogRequestInformation } from 'src/middlewares/interface/logger';
import { getIpAddress, getLanguage } from 'src/utils/get-ip-address';

import { AuthService } from '../auth.service';

/**
 * Passport strategy for local authentication.
 *
 * @extends {PassportStrategy(Strategy)}
 *
 * @description
 * This strategy is used for local (username and password) authentication. It uses
 * AuthService to validate the user's credentials. The strategy is configured to
 * use 'email' as the username field.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  validate(request: Request, email: string, password: string) {
    const requestInformation = new AuditLogRequestInformation(
      getIpAddress(request?.headers['x-forwarded-for']),
      request.url,
      request.method,
    );

    const languagePreference = getLanguage(request?.headers['accept-language']);

    return this.authService.validateUser(
      email,
      password,
      requestInformation,
      languagePreference,
    );
  }
}
