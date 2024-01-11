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
import {
  AvatarResponse,
  UserDocument,
  UserLoginResponse,
  UserRegisterResponse,
  UserResponse,
} from './schemas';
import { AuthGuard } from './guards';
import { UserUpdateDto } from './dto/user.update.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { cloudinaryStorage } from 'src/configs/cloudinary.config';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ErrorResponse } from 'src/types';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Register new a user',
    description: 'Register new a user',
  })
  @ApiConflictResponse({
    description: 'Email in use',
    type: ErrorResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad request', type: ErrorResponse })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: UserRegisterResponse,
  })
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
  ): Promise<UserRegisterResponse> {
    return this.userService.registration(userRegisterDto);
  }

  @ApiOperation({ summary: 'User login', description: 'User login' })
  @ApiOkResponse({
    description: 'Successful response',
    type: UserLoginResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad request', type: ErrorResponse })
  @ApiUnauthorizedResponse({
    description: 'Email or password is wrong',
    type: ErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginResponse> {
    return this.userService.login(userLoginDto);
  }

  @ApiOperation({
    summary: 'Get current user information',
    description: 'Get current user information',
  })
  @Get('current')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    description: 'Successful response',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized',
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard)
  currentUser(@CurrentUser() user: UserDocument): UserResponse {
    return this.userService.getCurrent(user);
  }

  @ApiOperation({ summary: 'Logout the user', description: 'Logout the user' })
  @Post('logout')
  @ApiBearerAuth('token')
  @ApiNoContentResponse({
    description: 'User logged out successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized',
    type: ErrorResponse,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  logout(@CurrentUser() user: UserDocument) {
    return this.userService.logout(user);
  }

  @ApiOperation({
    summary: 'Update user information',
    description: 'Update user information',
  })
  @Put()
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: 'Successful response', type: UserResponse })
  @ApiBadRequestResponse({ description: 'Bad request', type: ErrorResponse })
  @ApiUnauthorizedResponse({
    description: 'Not authorized',
    type: ErrorResponse,
  })
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
  ): Promise<UserResponse> {
    return this.userService.updateProfile(user, body);
  }

  @ApiOperation({
    summary: 'Upload and update user avatar',
    description: 'Upload and update user avatar',
  })
  @Patch('avatars')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    description: 'Avatar uploaded successfully',
    type: AvatarResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized',
    type: ErrorResponse,
  })
  @ApiBadRequestResponse({ description: 'No image file', type: ErrorResponse })
  @ApiPayloadTooLargeResponse({
    description: 'Error: Payload Too Large',
    type: ErrorResponse,
  })
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
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: cloudinaryStorage,
      limits: { fileSize: 10485760 },
      fileFilter: (req, { mimetype }, callback) => {
        if (['image/jpeg', 'image/png'].includes(mimetype)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  )
  updateAvatar(
    @CurrentUser() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AvatarResponse> {
    return this.userService.updateAvatar(user, file?.path);
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
  ): Promise<UserLoginResponse> {
    return this.userService.googleLogin(email);
  }
}
