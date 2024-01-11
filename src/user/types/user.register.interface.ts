import { UserDocument } from '../schemas';

export interface IUserRegisterResponse {
  token: string;
  user: Pick<UserDocument, 'name' | 'email' | 'avatarURL' | 'createdAt'>;
}
