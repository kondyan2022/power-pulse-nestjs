import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Diary } from 'src/diary/schemas';
import { Exercise } from 'src/exercise/schemas';
import { User } from 'src/user/schemas';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Diary.name)
    private diaryModel: mongoose.Model<Diary>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Exercise.name)
    private exerciseModel: mongoose.Model<Exercise>,
  ) {}
  async getStats() {
    const stats = await this.diaryModel.aggregate([
      {
        $group: {
          _id: null,
          countOfExercises: { $sum: { $size: '$exercises' } },
          totalBurnedCalories: {
            $sum: {
              $sum: '$exercises.burnedCalories',
            },
          },
          totalExercisesTime: {
            $sum: {
              $sum: '$exercises.time',
            },
          },
        },
      },
    ]);
    stats[0].userCount = (await this.userModel.find()).length;
    stats[0].videoGuides = (await this.exerciseModel.find()).length;
    stats[0].totalExercisesTime = Math.round(
      stats[0].totalExercisesTime / 3600,
    );
    delete stats[0]['_id'];
    return stats[0];
  }
}
