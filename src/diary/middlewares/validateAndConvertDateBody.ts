import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidateAndConvertDateBody implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const getDateParts = (dateObj: Date) => {
      const year = dateObj.getFullYear().toString();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      return { year, month, day };
    };

    console.log('middleware run ');
    const date = req.body.date;
    const regex =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19[0-9][0-9]|20[012][0-9])$/;
    let dateForm: string;
    if (regex.test(date)) {
      dateForm = date.slice(6) + date.slice(3, 5) + date.slice(0, 2);
    } else {
      const dateObj = new Date(date);
      if (dateObj.toString() == 'Invalid Date') {
        throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
      }
      const { year, month, day } = getDateParts(dateObj);
      dateForm = `${year}${month}${day}`;
    }
    req.body = { ...req.body, date: dateForm };
    next();
  }
}
