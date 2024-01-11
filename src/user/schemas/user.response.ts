import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from './user.schema';

export class UserRegister extends OmitType(User, [
  'profile',
  'password',
  'token',
  'googleRedirected',
  'verify',
  'verificationToken',
]) {
  @ApiProperty({ type: 'string' })
  createdAt: Date | string | boolean;
}

export class UserResponse extends OmitType(User, [
  'password',
  'token',
  'googleRedirected',
  'verify',
  'verificationToken',
]) {
  @ApiProperty({ type: 'string' })
  _id: Types.ObjectId;
  @ApiProperty()
  createdAt?: Date | string | boolean;
}

export class UserRegisterResponse {
  @ApiProperty({
    required: true,
    example:
      'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  })
  token: string;
  @ApiProperty({ required: true })
  user: UserRegister;
}

export class UserLoginResponse extends OmitType(UserRegisterResponse, [
  'user',
]) {
  @ApiProperty({ required: true })
  user: UserResponse;
}

export class AvatarResponse {
  @ApiProperty({ required: true })
  avatarURL: string;
}
