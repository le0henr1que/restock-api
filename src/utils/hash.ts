import * as bcrypt from 'bcrypt';

/**
 * Hashes a string using bcrypt.
 *
 * @param {string} data - The string data to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed string.
 *
 * @example
 * hashData('myPassword')
 *   .then(hashedPassword => console.log(hashedPassword))
 *   .catch(err => console.error(err));
 *
 * @description
 * This function takes a string as input and returns a bcrypt-hashed version of it.
 * The bcrypt hash function is used with a salt round of 10 for hashing.
 */
export const hashData = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, 10);
};
