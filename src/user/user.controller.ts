import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto, UserRegisterDto } from './dto';
import { CurrentUser } from './decorator/decorator.user';
import { UserDocument } from './schemas';
import { AuthGuard } from './guards';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  registration(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.registration(userRegisterDto);
  }

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto);
  }

  @Get('current')
  @UseGuards(AuthGuard)
  currentUser(@CurrentUser() user: UserDocument) {
    return this.userService.getCurrent(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  logout(@CurrentUser() user: UserDocument) {
    return this.userService.logout(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  updateProfile(@CurrentUser() user: UserDocument, @Body() body) {
    return this.userService.updateProfile(user, body);
  }
}
