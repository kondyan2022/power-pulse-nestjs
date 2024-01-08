import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { IExpressRequest } from 'src/types';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const [bearer, token] = req.headers.authorization.split(' ');
    if (bearer !== 'Bearer') {
      req.user = null;
      next();
      return;
    }
    try {
      const secretKey = await this.configService.get('SECRET_KEY');
      const { id } = verify(token, secretKey) as JwtPayload;
      const user = await this.userService.findById(id);
      if (!user || !user.token || user.token !== token) {
        req.user = null;
        next();
        return;
      }
      req.user = user;
    } catch (error) {
      req.user = null;
    }
    next();
  }
}
