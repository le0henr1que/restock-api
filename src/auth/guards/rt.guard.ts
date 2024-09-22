import { AuthGuard } from '@nestjs/passport';

/**
 * Authentication guard for JWT refresh tokens.
 *
 * @extends {AuthGuard('jwt-refresh')}
 *
 * @description
 * This guard is used to protect routes and endpoints that require JWT refresh token authentication.
 * It extends the 'AuthGuard' class for 'jwt-refresh' strategy.
 */
export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
