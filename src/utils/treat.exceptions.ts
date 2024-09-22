import { InternalServerErrorException, HttpException } from '@nestjs/common';

import { isDevelopmentEnviroment, isTestEnviroment } from './environment';
import { Languages } from './language-preference';

/**
 * Generic error handling function.
 *
 * @param {Error} error - The error to be handled.
 * @param {string} [message] - Optional custom message to be included in the error.
 *
 * @description
 * obs: only console the error in console if the enviroment is development or test
 * This function is used for error handling throughout the application. It checks if the error is an
 * instance of HttpException, and if so, rethrows it. Otherwise, it throws an InternalServerErrorException
 * with an optional custom message. This ensures consistent error handling and proper error response formatting.
 */
export const handleError = (
  error: Error,
  languagePreference: Languages,
  optionals: {
    message?: string;
    identifierRequest: string;
  },
) => {
  if (isDevelopmentEnviroment()) {
    console.log(`[HandleError] ${optionals?.identifierRequest} ${error}`);
  }

  if (error instanceof HttpException) {
    // Se for uma exceção específica do NestJS common, relance-a
    throw error;
  } else {
    throw new InternalServerErrorException(
      optionals?.message
        ? optionals?.message
        : `${
            languagePreference == 'pt-BR'
              ? 'Ocorreu um erro inesperado, procure o suporte'
              : 'An unexpected error occurred.'
          }`,
    );
  }
};
