import { Languages } from './language-preference';

/**
 * Extracts the IP address from the request header.
 *
 * @param {string} reqHeader - The request header string that potentially contains the IP address.
 * @returns {string} The extracted IP address or the original request header if no IP address is found.
 *
 * @example
 * // Example of using getIpAddress function
 * const ip = getIpAddress(req.headers['x-forwarded-for']);
 *
 * @description
 * This function takes a request header string and attempts to extract the IP address from it.
 * The function expects the header to contain IP addresses separated by commas, as is common
 * with headers like 'X-Forwarded-For'. It returns the first IP address found, or the entire
 * header string if no IP address is separated by commas. This is useful for logging,
 * authentication, or tracking the source of a request.
 */
export const getIpAddress = (reqHeader: string | string[]): string | null => {
  if (!reqHeader) {
    return null;
  }

  const header: string =
    typeof reqHeader === 'string' ? reqHeader : reqHeader.join(',');

  return header;
};

/**
 * Extracts the preferred language from the "accept-language" header.
 *
 * @param {string | string[]} reqHeader - The "accept-language" header from the HTTP request.
 * @returns {Languages | null} The preferred language code (e.g., 'pt-BR' or 'en-US') or null if not found.
 *
 * @example
 * // Sample "accept-language" header
 * const acceptLanguageHeader = 'pt-BR,en-US;q=0.9';
 *
 * // Get the language from the header
 * const language = getLanguage(acceptLanguageHeader);
 * // Returns 'pt-BR' based on the example header
 */
export const getLanguage = (reqHeader: string | string[]): Languages | null => {
  if (!reqHeader) {
    return 'pt-BR';
  }

  const header: string =
    typeof reqHeader === 'string' ? reqHeader : reqHeader.join(',');

  return (header as Languages) || 'pt-BR';
};
