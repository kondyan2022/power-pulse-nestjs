import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Exercise } from 'src/exercise/schemas';
import { PaginationResponse } from 'src/types';

export class ExerciseResponse extends Exercise {
  @ApiProperty({ type: 'string' })
  _id: Types.ObjectId;
}

export class ExerciseFilterResponse {
  @ApiPropertyOptional()
  bodyPart: string;

  @ApiPropertyOptional()
  equipment: string;

  @ApiPropertyOptional()
  target: string;
}
@ApiExtraModels(ExerciseFilterResponse)
export class ExerciseSearchResponse extends PaginationResponse {
  @ApiProperty({
    anyOf: [
      { $ref: getSchemaPath(ExerciseFilterResponse) },
      { type: 'string', example: 'All' },
    ],
  })
  filter: ExerciseFilterResponse | string;
  @ApiProperty({ type: ExerciseResponse, isArray: true })
  results: ExerciseResponse[];
}
