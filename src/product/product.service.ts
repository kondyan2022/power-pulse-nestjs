import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { Category, Product } from './schemas';
import { ProductSearchDto } from './dto';
import { IOptions, IProductSearch } from './types';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: mongoose.Model<Category>,
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async getProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async getProductsSearch(
    productSearchDto: ProductSearchDto,
  ): Promise<IProductSearch> {
    const {
      q = '',
      category,
      page = 0,
      limit = 20,
      recommend,
    } = productSearchDto;
    const options: IOptions = {
      title: { $regex: q, $options: 'i' },
    };
    if (category) {
      options.category = category;
    }

    // if (recommend !== undefined) {
    //   const {
    //     profile: { blood },
    //   } = req.user;
    //   options['groupBloodNotAllowed.' + blood] = !recommend;
    // }

    const product = await this.productModel
      .find(options)
      .limit(limit)
      .skip(limit * page)
      .sort({ title: 1 });
    const { length: totalCount } = await this.productModel.find(options);
    const totalPage = Math.ceil(totalCount / limit);

    return {
      searchkey: q,
      category: category ? category : 'All',
      recommend: recommend !== undefined ? String(recommend) : 'All',
      page,
      limit,
      totalPage,
      totalCount,
      results: product,
    };
  }
}
