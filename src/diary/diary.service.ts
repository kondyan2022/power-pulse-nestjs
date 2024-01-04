import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diary } from './schemas/diary.schema';
import mongoose from 'mongoose';
import { UserDocument } from 'src/user/schemas';

@Injectable()
export class DiaryService {
  constructor(
    @InjectModel(Diary.name)
    private diaryModel: mongoose.Model<Diary>,
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
}
