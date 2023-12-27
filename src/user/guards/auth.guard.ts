import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IExpressRequest } from 'src/types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IExpressRequest>();
    if (!request.user) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
