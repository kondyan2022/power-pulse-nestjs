import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserGoogleLoginDto {
  @ApiProperty({
    required: true,
    description: 'User email',
  })
  @IsEmail()
  email: string;
}
