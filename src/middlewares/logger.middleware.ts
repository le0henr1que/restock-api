import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from 'src/auth/models/UserPayload';
import { getIpAddress } from 'src/utils/get-ip-address';

const whiteUrls = ['/api/health', '/api/auth'];
const whiteListToken = ['/api/auth/me'];

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTPLogger');

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Parses and logs the HTTP request details.
   *
   * @param {number} start - The start time of the request.
   * @param {number} end - The end time of the request.
   * @param {string} ipRequest - The IP address of the request.
   * @param {string} userRequestEmail - The email of the user making the request.
   * @param {Record<string, any>} args - Additional arguments to log.
   *
   * @description
   * This method constructs and logs a message containing details about an HTTP request,
   * including its duration, IP address, user information, and other relevant data.
   */
  parseArgs(
    start: number,
    end: number,
    ipRequest: string,
    userRequestEmail: string,
    args: Record<string, any>,
  ) {
    const message = Object.entries(args)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    this.logger.log(
      message +
        ` +${end - start}ms${ipRequest != null ? ` | IP: ${ipRequest} ` : ''}${
          userRequestEmail != null ? `| User: ${userRequestEmail}` : ''
        }`,
    );
  }

  /**
   * Middleware function to log HTTP requests.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {Response} response - The outgoing HTTP response.
   * @param {NextFunction} next - The next function in the middleware chain.
   *
   * @description
   * This method is invoked on every HTTP request. It decodes the JWT token from the request
   * (if present), excludes certain endpoints from logging, and logs the request details
   * including the method, URL, status code, and request body (excluding sensitive data like passwords).
   */
  use(request: Request, response: Response, next: NextFunction): void {
    const token = request?.headers?.authorization
      ?.replace('Bearer', '')
      ?.trim();

    let userRequestEmail: string = null;

    if (
      token &&
      token != 'null' &&
      token != null &&
      token != 'undefined' &&
      !whiteListToken.includes(request.url)
    ) {
      const decodedUser: UserPayload | any = this.jwtService.decode(token);
      if (decodedUser?.email != null) {
        userRequestEmail = decodedUser?.email;
      }
    }

    const { method, baseUrl } = request;

    if (whiteUrls.some((url) => url == baseUrl)) {
      return next();
    }

    const start = Date.now();
    const ipRequest = getIpAddress(request?.headers['x-forwarded-for']) ?? null;
    response.on('close', () => {
      const { statusCode } = response;
      const end = Date.now();
      this.parseArgs(start, end, ipRequest, userRequestEmail, {
        method: method,
        endpoint: baseUrl,
        status: statusCode,
        ...(!this.isEmptyBody(request.body) && {
          body: this.getRequestBodyManipulated(request.body),
        }),
      });
    });

    next();
  }

  /**
   * Manipulates and sanitizes the request body for logging.
   *
   * @param {unknown} body - The request body to manipulate.
   * @returns {string} The manipulated request body as a string.
   *
   * @description
   * This method converts the request body into a string and sanitizes it by replacing
   * sensitive data like passwords. It is used in logging the request body without exposing
   * sensitive information.
   */
  getRequestBodyManipulated = (body: unknown): string => {
    const bodyRequestString = JSON.stringify(body);

    return bodyRequestString.replace(
      /("password"\s*:\s*")[^"]+(")/g,
      '$1*****$2',
    );
  };

  /**
   * Checks if the request body is empty.
   *
   * @param {any} body - The request body to check.
   * @returns {boolean} True if the body is empty, false otherwise.
   *
   * @description
   * This method checks whether the request body is empty, which is useful for determining
   * whether to include the body in the logged request details.
   */
  isEmptyBody = (body: any): boolean => {
    const bodyRequestString = JSON.stringify(body);
    if (
      bodyRequestString == '{}' ||
      bodyRequestString == '[]' ||
      bodyRequestString == '' ||
      bodyRequestString == null
    ) {
      return true;
    }
  };
}
