import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { IExpressRequest } from 'src/types';

@Injectable()
export class HasProfileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IExpressRequest>();
    if (!request.user?.profile) {
      throw new HttpException(
        'User must have profile!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
