import { IPagination } from 'src/types';
import { IFilter } from './filter.type';
import { Exercise } from '../schemas';

export interface IExerciseSearch extends IPagination {
  filter: IFilter | string;
  results: Exercise[];
}
