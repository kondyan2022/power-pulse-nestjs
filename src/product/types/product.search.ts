import { IPagination } from 'src/types';
import { Product } from '../schemas';

export interface IProductSearch extends IPagination {
  searchkey: string;
  category: string;
  recommend: string;
  results: Product[];
}
