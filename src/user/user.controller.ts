import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserGoogleLoginDto, UserLoginDto, UserRegisterDto } from './dto';
import { CurrentUser } from './decorator/decorator.user';
import { UserDocument } from './schemas';
import { AuthGuard } from './guards';
import {
  IUserCurrentResponse,
  IUserLoginResponse,
  IUserRegisterResponse,
} from './types';
import { UserUpdateDto } from './dto/user.update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { cloudinaryStorage } from 'src/configs/cloudinary.config';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ description: 'Register new a user' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  registration(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<IUserRegisterResponse> {
    return this.userService.registration(userRegisterDto);
  }

  @ApiOperation({ description: 'User login' })
  @Post('login')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  login(@Body() userLoginDto: UserLoginDto): Promise<IUserLoginResponse> {
    return this.userService.login(userLoginDto);
  }

  @ApiOperation({ description: 'Get current user information' })
  @Get('current')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  currentUser(@CurrentUser() user: UserDocument) {
    return this.userService.getCurrent(user);
  }

  @ApiOperation({ description: 'Logout the user' })
  @Post('logout')
  @ApiBearerAuth('token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  logout(@CurrentUser() user: UserDocument) {
    return this.userService.logout(user);
  }

  @ApiOperation({ description: 'Update user information' })
  @Put()
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  updateProfile(
    @CurrentUser() user: UserDocument,
    @Body() body: UserUpdateDto,
  ): Promise<IUserCurrentResponse> {
    return this.userService.updateProfile(user, body);
  }

  @ApiOperation({ description: 'Upload and update user avatar' })
  @Patch('avatars')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['avatar'],
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', { storage: cloudinaryStorage }))
  updateAvatar(@UploadedFile() file: Express.Multer.File): string {
    return file?.path;
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @HttpCode(HttpStatus.FOUND)
  @Redirect()
  async googleAuth() {
    return this.userService.googleAuth();
  }

  @ApiExcludeEndpoint()
  @Get('google-redirect')
  @Redirect()
  async googleRedirect(@Req() request: Request, @Query('code') code: string) {
    return this.userService.googleRedirect(code);
  }

  @ApiExcludeEndpoint()
  @Post('googlelogin')
  @UsePipes(new ValidationPipe())
  async googleLogin(
    @Body() { email }: UserGoogleLoginDto,
  ): Promise<IUserLoginResponse> {
    return this.userService.googleLogin(email);
  }
}
