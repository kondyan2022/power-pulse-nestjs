import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    required: true,
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
