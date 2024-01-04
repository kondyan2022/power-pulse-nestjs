import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diary } from './schemas/diary.schema';
import mongoose from 'mongoose';
import { UserDocument } from 'src/user/schemas';
import { Product } from 'src/product/schemas';
import { DiaryProductAddDto } from './dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectModel(Diary.name)
    private diaryModel: mongoose.Model<Diary>,
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async diaryByDate(user: UserDocument, date: string) {
    const {
      _id,
      profile: { DSN, BMR },
    } = user;
    const diaryItem = await this.diaryModel.findOne({ date, owner: _id });
    if (!diaryItem) {
      return {
        owner: _id,
        date,
        DSN,
        BMR,
        products: [],
        exercises: [],
        burnedCalories: 0,
        consumedCalories: 0,
        leftExercisesTime: DSN,
        leftCalories: BMR,
      };
    }
    // diaryItem.date = reverseDate(diaryItem.date);
    return diaryItem;
  }

  async postProductsToDiary(
    user: UserDocument,
    diaryProductAddDto: DiaryProductAddDto,
  ) {
    const {
      _id,
      profile: { BMR, DSN, blood },
    } = user;

    const {
      product,
      date,
      amount,
      calories: consumeCalories,
    } = diaryProductAddDto;
    let diaryItem = await this.diaryModel.findOne({ date, owner: _id });
    if (!diaryItem) {
      diaryItem = await this.diaryModel.create({ date, owner: _id, DSN, BMR });
    }
    const productItem = await this.productModel.findById(product);
    if (!productItem) {
      // throw HttpError(400, `Product with id=${productId} not found`);
    }
    const { title, category, groupBloodNotAllowed } = productItem;
    diaryItem = await this.diaryModel
      .findByIdAndUpdate(
        diaryItem._id,
        {
          $push: {
            products: {
              product,
              title,
              category,
              weight: amount,
              consumeCalories,
              recommend: !groupBloodNotAllowed[blood],
            },
          },
        },
        {
          new: true,
          select: '-createdAt -updatedAt ',
        },
      )
      .populate('products.product');
    console.log(diaryItem);
    // diaryItem.date = reverseDate(diaryItem.date);
    return diaryItem;
  }
  //   async postProductsToDiary(user, body) {

  //     const {
  //       product: productId,
  //       date,
  //       amount,
  //       calories: consumeCalories,
  //     } = body;
  //     let diaryItem = await this.diaryModel.findOne({ date, owner: _id });
  //     if (!diaryItem) {
  //       diaryItem = await this.diaryModel.create({ date, owner: _id, DSN, BMR });
  //     }
  //     const product = await this.productModel.findById(productId);
  //     if (!product) {
  //       throw HttpError(400, `Product with id=${productId} not found`);
  //     }

  //     const { title, category, groupBloodNotAllowed } = product;
  //     diaryItem = await this.diaryModel.findByIdAndUpdate(
  //       diaryItem._id,
  //       {
  //         $push: {
  //           products: {
  //             title,
  //             category,
  //             weight: amount,
  //             consumeCalories,
  //             recommend: !groupBloodNotAllowed[blood],
  //           },
  //         },
  //       },
  //       {
  //         new: true,
  //         select: '-createdAt -updatedAt ',
  //       },
  //     );
  //     // diaryItem.date = reverseDate(diaryItem.date);
  //     return diaryItem;
  //   }
}
