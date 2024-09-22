/* eslint-disable @typescript-eslint/no-inferrable-types */
import { sign, verify } from 'jsonwebtoken';
import * as crypto from 'crypto';

const secretKey = process.env.TK_CODE_VERIFICATION_SECRET;

export async function generateVerificationCode(
  length: number = 6,
): Promise<string> {
  try {
    const code = Array.from({ length }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
    return code;
  } catch (error) {
    console.error('Erro ao gerar o token:', error);
    throw new Error('Erro ao gerar o token');
  }
}
