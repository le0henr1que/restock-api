import { Request } from 'express';

import { UserPayload } from './UserPayload';

export interface AuthRequest extends Request {
  user: UserPayload;
}
