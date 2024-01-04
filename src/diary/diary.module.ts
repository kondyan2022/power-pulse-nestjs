import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Diary, DiarySchema } from './schemas/diary.schema';
import { Product, ProductSchema } from 'src/product/schemas';
import { ValidateAndConvertDateBody } from './middlewares';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Diary.name, schema: DiarySchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateAndConvertDateBody)
      .forRoutes({ path: 'diary/*', method: RequestMethod.POST });
  }
}
