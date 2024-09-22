import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getIpAddress } from 'src/utils/get-ip-address';

import { UserPayload } from '../models/UserPayload';

/**
 * Passport strategy for JWT-based authentication.
 *
 * @extends {PassportStrategy(Strategy, 'jwt')}
 *
 * @description
 * This strategy is used for JWT authentication. It extracts the JWT token from the
 * authorization header and validates it. The strategy requires a secret key to verify
 * the token's signature.
 */
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: UserPayload) {
    const ip = getIpAddress(request.headers['x-forwarded-for']);
    console.log('payload', payload);
    return {
      id: payload?.id,
      iat: payload?.iat,
      exp: payload?.exp,
      organizationId: payload?.organizationId,
      email: payload?.email,
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
    };
  }
}
