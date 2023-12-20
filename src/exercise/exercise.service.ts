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
}
