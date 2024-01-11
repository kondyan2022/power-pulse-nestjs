import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ExerciseGroup } from 'src/exercise/schemas';

export class ExerciseGroupResponse extends ExerciseGroup {
  @ApiProperty({ type: 'string' })
  _id: Types.ObjectId;
}
