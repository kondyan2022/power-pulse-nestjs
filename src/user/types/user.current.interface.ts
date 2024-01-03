import { UserDocument } from '../schemas';

export interface IUserCurrentResponse
  extends Pick<
    UserDocument,
    '_id' | 'name' | 'email' | 'avatarURL' | 'createdAt' | 'profile'
  > {}
