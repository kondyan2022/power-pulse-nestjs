import { HttpException, HttpStatus } from '@nestjs/common';

export const validateAndReverseDate = (value: string): string => {
  const getDateParts = (dateObj: Date) => {
    const year = dateObj.getFullYear().toString();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return { year, month, day };
  };

  const date = value;
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
  return dateForm;
};
