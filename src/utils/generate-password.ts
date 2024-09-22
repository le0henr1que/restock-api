import generator from 'generate-password-ts';

/**
 * Generates a password of a specified length.
 *
 * This function utilizes the 'generator' object's 'generate' method to create a password.
 * The generated password includes numbers, lowercase and uppercase characters. The length
 * of the password can be specified, and it defaults to 12 characters if not provided. The
 * resulting password is trimmed of any leading or trailing whitespace before being returned.
 *
 * @param {number} [length=12] - The length of the password to be generated. Defaults to 12 if not provided.
 * @returns {string} The generated password.
 */
export const generatePassword = (length = 12): string => {
  const password = generator.generate({
    length,
    numbers: true,
    lowercase: true,
    uppercase: true,
  });

  return password.trim();
};
