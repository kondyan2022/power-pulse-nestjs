import { Request } from 'express';
import { User } from 'src/user/schemas';

export interface IExpressRequest extends Request {
  user?: User;
}
