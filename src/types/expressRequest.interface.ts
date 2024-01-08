import { Request } from 'express';
import { Types } from 'mongoose';
import { User } from 'src/user/schemas';

export interface IExpressRequest extends Request {
  user?: User & { _id?: Types.ObjectId };
}
