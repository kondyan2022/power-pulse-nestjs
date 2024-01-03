import { IsString, MinLength } from 'class-validator';
import { UserLoginDto } from './user.login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto extends UserLoginDto {
  @ApiProperty({
    required: true,
    minLength: 2,
    description: 'User name',
  })
  @IsString()
  @MinLength(2)
  name: string;
}
