import { verify } from 'jsonwebtoken';
import { UserPayload } from 'src/auth/models/UserPayload';

/**
 * Validates a JSON Web Token (JWT).
 *
 * @param {string} token - The JWT to validate.
 * @returns {Promise<{ tokenIsValid: boolean; user?: UserPayload; }>}
 * A Promise that resolves with a boolean indicating whether the token is valid and if is valid, the user decoded.
 * @async
 */
export const validateToken = async (
  token: string,
): Promise<{ tokenIsValid: boolean; user?: UserPayload }> => {
  const tokenManipulated = token.replace('Bearer ', '');

  let tokenIsValid = false;
  let decodedToken: UserPayload | null;

  verify(tokenManipulated, process.env.AT_SECRET, (err, decoded) => {
    decodedToken = decoded as UserPayload;
    if (err) {
      tokenIsValid = false;
    } else {
      tokenIsValid = true;
    }
  });

  return {
    tokenIsValid,
    user: decodedToken,
  };
};
