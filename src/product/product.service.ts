import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import * as mongoose from 'mongoose';
import { Product } from './schemas/product.schema';

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
}
