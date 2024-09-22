import { baseCss } from '../css/base';

/**
 * Processes the given HTML string by replacing a specific placeholder with the base CSS.
 *
 * This function searches for the '{{BASE_CSS}}' placeholder within the provided HTML string
 * and replaces it with the content of `baseCss`. This is useful for injecting CSS directly
 * into HTML templates.
 *
 * @param {string} html - The HTML string to be processed.
 * @returns {string} The processed HTML string.
 */
export const baseProcessor = (html: string): string => {
  return html.replace('{{BASE_CSS}}', baseCss);
};
