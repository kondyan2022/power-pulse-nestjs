import { IsString, MinLength } from 'class-validator';
import { UserLoginDto } from './user.login.dto';

export class UserRegisterDto extends UserLoginDto {
  @IsString()
  @MinLength(2)
  name: string;
}
