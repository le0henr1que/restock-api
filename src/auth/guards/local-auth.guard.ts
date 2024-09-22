import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesHelperKey, getMessage } from 'src/helpers/messages.helper';
import { getLanguage } from 'src/utils/get-ip-address';

/**
 * Authentication guard for local (username and password) authentication.
 *
 * @extends {AuthGuard('local')}
 *
 * @description
 * This guard is used for local authentication, such as email and password. It extends
 * the 'AuthGuard' class for 'local' strategy. It handles the request and throws an
 * UnauthorizedException if authentication fails, along with a specific error message.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err) throw err;

    if (!user) {
      const requestHeaders = context.switchToHttp().getRequest();

      const languagePreference = getLanguage(
        requestHeaders?.headers['accept-language'],
      );

      throw new UnauthorizedException(
        getMessage(
          MessagesHelperKey.PASSWORD_OR_EMAIL_INVALID,
          languagePreference,
        ),
      );
    }

    return user;
  }
}
