import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AvatarResponse,
  User,
  UserDocument,
  UserLoginResponse,
  UserRegisterResponse,
  UserResponse,
} from './schemas';
import * as mongoose from 'mongoose';
import { UserLoginDto, UserRegisterDto, UserUpdateDto } from './dto';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { HttpService } from '@nestjs/axios';

const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dfhl9z7ez/image/upload/v1698618013/avatars/noavatar.png';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly user: mongoose.Model<User>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async registration(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserRegisterResponse> {
    const { email, password } = userRegisterDto;
    const user = await this.user.findOne({ email });

    if (user) {
      throw new HttpException('Email in use', HttpStatus.CONFLICT);
    }

    const hashPassword = await hash(password, 10);
    const avatarURL = DEFAULT_AVATAR;
    const verify = true; //Email - вважаємо перевірено при створенні

    const newUser: UserDocument = await this.user.create({
      ...userRegisterDto,
      avatarURL,
      password: hashPassword,
      verificationToken: 'No',
      verify,
    });

    const payload = { id: newUser._id };
    const secretKey = await this.configService.get('SECRET_KEY');
    const token = sign(payload, secretKey, { expiresIn: '23h' });
    await this.user.findByIdAndUpdate(newUser._id, { token });

    return {
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        avatarURL,
        createdAt: newUser.createdAt,
      },
    };
  }

  findById(id: string): Promise<User> {
    return this.user.findById(id);
  }

  async login(userRegisterDto: UserLoginDto): Promise<UserLoginResponse> {
    const { email, password } = userRegisterDto;
    let user = await this.user.findOne({ email });
    if (!user) {
      throw new HttpException(
        'Email or password is wrong',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.verify) {
      throw new HttpException('Email not verify', HttpStatus.UNAUTHORIZED);
    }
    const passwordCompare = await compare(password, user.password);
    if (!passwordCompare) {
      throw new HttpException(
        'Email or password is wrong',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user._id };
    const secretKey = await this.configService.get('SECRET_KEY');

    const token = sign(payload, secretKey, { expiresIn: '23h' });
    user = await this.user.findByIdAndUpdate(
      user._id,
      { token, googleRedirected: false },
      {
        new: true,
        select:
          '-updatedAt -password -token -verify -verificationToken -googleRedirected',
      },
    );
    return {
      token,
      user,
    };
  }

  getCurrent(currentUser: UserDocument): UserResponse {
    const { _id, name, email, avatarURL, profile, createdAt } = currentUser;
    return { _id, name, email, avatarURL, profile, createdAt };
  }

  async logout(currentUser: UserDocument): Promise<void> {
    const { _id } = currentUser;
    await this.user.findByIdAndUpdate(_id, { token: '' });
  }

  async updateProfile(
    user: UserDocument,
    body: UserUpdateDto,
  ): Promise<UserResponse> {
    const { _id } = user;
    return await this.user.findByIdAndUpdate(_id, body, {
      new: true,
      select:
        '-updatedAt -password -token -verify -verificationToken -googleRedirected',
    });
  }

  async updateAvatar(
    user: UserDocument,
    avatarURL: string,
  ): Promise<AvatarResponse> {
    if (!avatarURL) {
      throw new HttpException('No image file', HttpStatus.BAD_REQUEST);
    }
    const { _id } = user;
    await this.user.findByIdAndUpdate(_id, { avatarURL });
    return { avatarURL };
  }

  googleAuth(): { url: string } {
    const stringifiedParams = new URLSearchParams({
      client_id: this.configService.get('GOOGLE_CLIENT_ID'),
      redirect_uri: `${this.configService.get(
        'BASE_URL',
      )}/users/google-redirect`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    }).toString();

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
    };
  }

  async googleRedirect(code: string) {
    const tokenData = await this.httpService.axiosRef({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/users/google-redirect`,
        grant_type: 'authorization_code',
        code,
      },
    });

    const userData = await this.httpService.axiosRef({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });
    const { email, name, picture } = userData.data;
    let user = await this.user.findOne({ email });
    if (!user) {
      const hashPassword = await hash('google authorization', 10);
      const avatarURL = picture;
      const verificationToken = 'No'; // Токен при verify = true не має значення
      const verify = true; //Email - вважаємо перевірено при створенні

      user = await this.user.create({
        name,
        email,
        avatarURL,
        password: hashPassword,
        verificationToken,
        verify,
      });
    }

    const payload = { id: user._id };
    const secretKey = await this.configService.get('SECRET_KEY');
    const token = sign(payload, secretKey, {
      expiresIn: '23h',
    });
    await this.user.findByIdAndUpdate(user._id, {
      token,
      googleRedirected: true,
    });

    return {
      url: `${this.configService.get(
        'FRONTEND_URL',
      )}/googlelogin?email=${email}`,
    };
  }

  async googleLogin(email: string): Promise<UserLoginResponse> {
    let user = await this.user.findOne({ email });
    if (!user) {
      throw new HttpException(
        'Email or password is wrong',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { id: user._id };
    const secretKey = await this.configService.get('SECRET_KEY');
    const token = sign(payload, secretKey, { expiresIn: '23h' });
    user = await this.user.findByIdAndUpdate(
      user._id,
      { token, googleRedirected: false },
      {
        new: true,
        select:
          '-updatedAt -password -token -verify -verificationToken -googleRedirected',
      },
    );
    return {
      token,
      user,
    };
  }
}
