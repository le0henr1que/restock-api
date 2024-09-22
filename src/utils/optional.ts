/**
 * Checks if the provided optionals object contains valid mapper information.
 *
 * @param {Object} optionals - The optional parameters object.
 * @param {Object} optionals.mapper - The mapper information.
 * @param {any} optionals.mapper.sourceClass - The source class for mapping.
 * @param {any} optionals.mapper.destinationClass - The destination class for mapping.
 * @returns {boolean} - Returns true if valid mapper information is present; otherwise, false.
 */
export const hasOptionalMapper = (optionals?: {
  mapper?: {
    sourceClass: any;
    destinationClass: any;
  };
}): boolean => {
  if (!optionals) return false;
  if (!optionals?.mapper) return false;

  return (
    optionals?.mapper &&
    optionals?.mapper.destinationClass &&
    optionals?.mapper.sourceClass
  );
};
