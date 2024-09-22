/**
 * Checks if the current environment is set to 'TEST'.
 *
 * @returns {boolean} True if the environment is 'TEST', false otherwise.
 * @description This function checks the environment variable 'ENV' and
 *              returns true if it's set to 'TEST', indicating a test environment.
 */
export const isTestEnviroment = (): boolean =>
  process.env.ENV?.toUpperCase() == 'TEST';

/**
 * Checks if the current environment is set to 'DEV'.
 *
 * @returns {boolean} True if the environment is 'DEV', false otherwise.
 * @description This function checks the environment variable 'ENV' and
 *              returns true if it's set to 'DEV', indicating a development environment.
 */
export const isDevelopmentEnviroment = (): boolean =>
  process.env.ENV?.toUpperCase() == 'DEV';

/**
 * Checks if the current environment is set to 'HOMOLOG'.
 *
 * @returns {boolean} True if the environment is 'HOMOLOG', false otherwise.
 * @description This function checks the environment variable 'ENV' and
 *              returns true if it's set to 'HOMOLOG', indicating a homologation environment.
 */
export const isHomologationEnvironment = (): boolean =>
  process.env.ENV?.toUpperCase() == 'HOMOLOG';

/**
 * Checks if the current environment is set to 'PROD'.
 *
 * @returns {boolean} True if the environment is 'PROD', false otherwise.
 * @description This function checks the environment variable 'ENV' and
 *              returns true if it's set to 'PROD', indicating a production environment.
 */
export const isProductionEnviroment = (): boolean =>
  process.env.ENV?.toUpperCase() == 'PROD';

/**
 * Checks if multiple logins are enabled.
 *
 * @returns {boolean} True if multiple logins are enabled, false otherwise.
 * @description This function checks the environment variable 'MULTIPLE_LOGIN' and
 *              returns true if it's set to 'true', indicating that multiple logins are allowed.
 */
export const enabledMultipleLogin = (): boolean =>
  process.env.MULTIPLE_LOGIN?.toUpperCase() == 'TRUE';

/**
 * Checks if the required IP check in requests is deactivated based on an environment variable.
 *
 * @returns {boolean} Returns true if the environment variable DEACTIVATE_REQUIRED_IPS_IN_REQUEST is set to 'true'.
 */
export const deactivateRequiredIpsInRequest = (): boolean =>
  process.env.DEACTIVATE_REQUIRED_IPS_IN_REQUEST?.toUpperCase() == 'TRUE';
