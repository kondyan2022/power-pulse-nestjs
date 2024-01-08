import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diary } from './schemas/diary.schema';
import mongoose from 'mongoose';
import { UserDocument } from 'src/user/schemas';
import { Product } from 'src/product/schemas';
import {
  DiaryDeleteFromListDto,
  DiaryExerciseAddDto,
  DiaryItemDeleteDto,
  DiaryProductAddDto,
} from './dto';
import { reverseToNormalDate } from 'src/helpers';
import { Exercise } from 'src/exercise/schemas';

@Injectable()
export class DiaryService {
  constructor(
    @InjectModel(Diary.name)
    private diaryModel: mongoose.Model<Diary>,
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
    @InjectModel(Exercise.name)
    private exerciseModel: mongoose.Model<Exercise>,
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
    diaryItem.date = reverseToNormalDate(diaryItem.date);
    return diaryItem;
  }

  async postProductToDiary(
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
      throw new HttpException(
        `Product with id=${product} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { title, category, groupBloodNotAllowed } = productItem;
    diaryItem = await this.diaryModel.findByIdAndUpdate(
      diaryItem._id,
      {
        $push: {
          products: {
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
    );

    diaryItem.date = reverseToNormalDate(diaryItem.date);
    return diaryItem;
  }

  async postExerciseToDiary(
    user: UserDocument,
    diaryExerciseAddDto: DiaryExerciseAddDto,
  ) {
    const {
      _id,
      profile: { BMR, DSN },
    } = user;
    const {
      exercise,
      date,
      time,
      calories: burnedCalories,
    } = diaryExerciseAddDto;
    let diaryItem = await this.diaryModel.findOne({ date, owner: _id });
    if (!diaryItem) {
      diaryItem = await this.diaryModel.create({ date, owner: _id, DSN, BMR });
    }
    const exerciseItem = await this.exerciseModel.findById(exercise);
    if (!exerciseItem) {
      throw new HttpException(
        `Exercise with id=${exercise} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { bodyPart, equipment, name, target } = exerciseItem;
    diaryItem = await this.diaryModel.findByIdAndUpdate(
      diaryItem._id,
      {
        $push: {
          exercises: {
            bodyPart,
            equipment,
            name,
            target,
            time,
            burnedCalories,
          },
        },
      },
      {
        new: true,
        select: '-createdAt -updatedAt ',
      },
    );
    diaryItem.date = reverseToNormalDate(diaryItem.date);

    return diaryItem;
  }
  async deleteFromDiary(user: UserDocument, dto: DiaryItemDeleteDto) {
    const { _id } = user;
    const { date, itemid, tablename } = dto;

    let diaryItem = await this.diaryModel.findOne({ date, owner: _id });

    if (!diaryItem) {
      throw new HttpException(`Diary not found`, HttpStatus.NOT_FOUND);
    }
    diaryItem = await this.diaryModel.findByIdAndUpdate(
      diaryItem._id,
      {
        $pull: {
          [tablename]: { _id: itemid },
        },
      },
      { new: true, select: '-createdAt -updatedAt ' },
    );
    diaryItem.date = reverseToNormalDate(diaryItem.date);
    return diaryItem;
  }
  async deleteProductFromDiary(
    user: UserDocument,
    dto: DiaryDeleteFromListDto,
  ) {
    const { _id } = user;
    const { date, itemid } = dto;

    let diaryItem = await this.diaryModel.findOne({ date, owner: _id });

    if (!diaryItem) {
      throw new HttpException(`Diary not found`, HttpStatus.NOT_FOUND);
    }

    diaryItem = await this.diaryModel.findByIdAndUpdate(
      diaryItem._id,
      {
        $pull: {
          products: { _id: itemid },
        },
      },
      { new: true, select: '-createdAt -updatedAt ' },
    );
    diaryItem.date = reverseToNormalDate(diaryItem.date);
    return diaryItem;
  }

  async deleteExerciseFromDiary(
    user: UserDocument,
    dto: DiaryDeleteFromListDto,
  ) {
    const { _id } = user;
    const { date, itemid } = dto;

    let diaryItem = await this.diaryModel.findOne({ date, owner: _id });

    if (!diaryItem) {
      throw new HttpException(`Diary not found`, HttpStatus.NOT_FOUND);
    }

    diaryItem = await this.diaryModel.findByIdAndUpdate(
      diaryItem._id,
      {
        $pull: {
          exercises: { _id: itemid },
        },
      },
      { new: true, select: '-createdAt -updatedAt ' },
    );
    diaryItem.date = reverseToNormalDate(diaryItem.date);
    return diaryItem;
  }
}
