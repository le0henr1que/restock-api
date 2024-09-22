import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getIpAddress } from 'src/utils/get-ip-address';

import { UserPayload } from '../models/UserPayload';

/**
 * Passport strategy for JWT refresh token authentication.
 *
 * @extends {PassportStrategy(Strategy, 'jwt-refresh')}
 *
 * @description
 * This strategy is used for JWT refresh token authentication. It extracts the refresh
 * token from the authorization header and validates it. The strategy requires a secret
 * key to verify the token's signature and uses it to generate a new access token.
 */
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: UserPayload) {
    const refreshToken = request?.headers?.authorization
      .replace('Bearer', '')
      .trim();

    const ip = getIpAddress(request.headers['x-forwarded-for']);

    return {
      id: payload?.id,
      iat: payload?.iat,
      exp: payload?.exp,
      email: payload?.email,
      organizationId: payload?.organizationId,
      roles: payload?.roles,
      assignments: payload?.assignments,
      status: payload?.status,
      blocked: payload?.blocked,
      loginAttempts: payload?.loginAttempts,
      name: payload?.name,
      sub: payload?.sub,
      createdAt: payload?.createdAt,
      deletedAt: payload?.deletedAt,
      version: payload?.version,
      ip,
      refreshToken,
    };
  }
}
