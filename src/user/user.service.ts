import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas';
import * as mongoose from 'mongoose';
import { UserLoginDto, UserRegisterDto } from './dto';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dfhl9z7ez/image/upload/v1698618013/avatars/noavatar.png';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private user: mongoose.Model<User>,
    private configService: ConfigService,
  ) {}
  async registration(userRegisterDto: UserRegisterDto): Promise<any> {
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

  async login(userRegisterDto: UserLoginDto): Promise<any> {
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

  getCurrent(currentUser: UserDocument) {
    const { _id, name, email, avatarURL, profile, createdAt } = currentUser;
    return { _id, name, email, avatarURL, profile, createdAt };
  }

  async logout(currentUser: UserDocument): Promise<void> {
    const { _id } = currentUser;
    await this.user.findByIdAndUpdate(_id, { token: '' });
  }

  async updateProfile(user, body) {
    const { _id } = user;
    return await this.user.findByIdAndUpdate(_id, body, {
      new: true,
      select:
        '-updatedAt -password -token -verify -verificationToken -googleRedirected',
    });
  }
}
