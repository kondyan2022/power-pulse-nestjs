import { groupBloodNotAllowedSchema } from '../schemas';

export interface IOptions {
  title?: { [key: string]: string };
  category?: string;
  groupBloodNotAllowed?: Partial<groupBloodNotAllowedSchema>;
}
