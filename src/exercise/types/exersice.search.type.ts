import { IPagination } from 'src/types';
import { Exercise } from '../schemas';
import { IFilter } from './filter.type';

export interface IExerciseSearch extends IPagination {
  filter: IFilter | string;
  results: Exercise[];
}
