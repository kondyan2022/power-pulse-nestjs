import { UserDocument } from '../schemas';

export interface IUserLoginResponse {
  token: string;
  user: Omit<
    UserDocument,
    'password' | 'googleRedirected' | 'verify' | 'token' | 'verificationToken'
  >;
}
