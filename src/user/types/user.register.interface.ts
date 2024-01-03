// export interface IUser {
//   _id: string;
//   name: string;
//   email: string;
//   avatarURL: string;
//   profile?: {
//     height: number;
//     currentWeight: number;
//     desiredWeight: number;
//     birthday: Date;
//     blood: [1, 2, 3, 4];
//     sex: ['male', 'female'];
//     levelActivity: [1, 2, 3, 4];
//     DSN: number;
//     BMR: number;
//   };
// }

import { UserDocument } from '../schemas';

export interface IUserRegisterResponse {
  token: string;
  user: Pick<UserDocument, 'name' | 'email' | 'avatarURL' | 'createdAt'>;
}
