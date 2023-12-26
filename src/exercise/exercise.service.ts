import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Exercise, ExerciseGroup } from './schemas';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(ExerciseGroup.name)
    private exerciseGroup: mongoose.Model<ExerciseGroup>,
    @InjectModel(Exercise.name)
    private exercise: mongoose.Model<Exercise>,
  ) {}

  async getExerciseGroups(): Promise<ExerciseGroup[]> {
    return this.exerciseGroup.find().exec();
  }

  async getExercise(): Promise<Exercise[]> {
    return this.exercise.find().exec();
  }

  async getExercisesSearch(exerciseSearchDto: any): Promise<any> {
    const {
      filter,
      value = '',
      target = '',
      limit = 20,
      page = 0,
    } = exerciseSearchDto;

    const options: any = {};

    if (filter) {
      options[filter] = value;
    }

    if (target) {
      options.target = target;
    }

    const exercises = await this.exercise
      .find(options)
      .limit(limit)
      .skip(limit * page)
      .sort({ title: 1 });
    const { length: totalCount } = await this.exercise.find(options);
    const totalPage = Math.ceil(totalCount / limit);

    return {
      filter: filter ? options : 'All',
      page,
      limit,
      totalPage,
      totalCount,
      results: exercises,
    };
  }
}
