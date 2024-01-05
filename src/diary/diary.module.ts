import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Diary, DiarySchema } from './schemas/diary.schema';
import { Product, ProductSchema } from 'src/product/schemas';
import { Exercise, ExerciseSchema } from 'src/exercise/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Diary.name, schema: DiarySchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
