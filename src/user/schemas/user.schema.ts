import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({
  _id: false,
  toJSON: { virtuals: true },
  virtuals: {
    BMR: {
      get() {
        const currentData: any = new Date();
        const age = Math.floor(
          (currentData - this.birthday) / (1000 * 60 * 60 * 24 * 365),
        );
        return Math.round(
          (10 * this.currentWeight +
            6.25 * this.height -
            5 * age +
            (this.sex === 'male' ? 5 : -160)) *
            this.levelActivity,
        );
      },
    },
  },
})
class Profile {
  @ApiProperty({ required: true })
  @Prop({ min: [150, 'Must be at least 150, got {VALUE}!'], required: true })
  height: number;

  @ApiProperty({ required: true })
  @Prop({ min: [35, 'Must be at least 35, got {VALUE}!'], required: true })
  currentWeight: number;

  @ApiProperty({ required: true })
  @Prop({ min: [35, 'Must be at least 35, got {VALUE}!'], required: true })
  desiredWeight: number;

  @ApiProperty({ required: true })
  @Prop({
    validate: {
      validator: function (v) {
        const checkDate = new Date(v);
        checkDate.setFullYear(checkDate.getFullYear() + 18);
        const nowDate = new Date();
        return nowDate >= checkDate;
      },
      message: (props) => `${props.value} is not valid`,
    },
    required: true,
  })
  birthday: Date;
  @ApiProperty({ required: true })
  @Prop({
    enum: [1, 2, 3, 4],
    required: true,
  })
  blood: number;

  @ApiProperty({ required: true })
  @Prop({
    enum: ['male', 'female'],
    required: true,
  })
  sex: string;

  @ApiProperty({ required: true })
  @Prop({ enum: [1, 2, 3, 4, 5], required: true })
  levelActivity: number;
  @ApiProperty({ required: true })
  @Prop({ default: 110 })
  DSN: number;
  @ApiProperty({ required: true })
  BMR: number;
}

export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @ApiProperty()
  @Prop({
    min: [2, 'Minimum 2 symbol'],
    required: [true, 'Set name for user'],
  })
  name: string;

  @Prop({
    required: [true, 'Set password for user'],
  })
  password: string;

  @ApiProperty()
  @Prop({
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dfhl9z7ez/image/upload/v1698618013/avatars/noavatar.png',
  })
  @Prop()
  avatarURL: string;

  @Prop()
  token: string;

  @Prop({ default: false })
  googleRedirected: boolean;

  @Prop({ default: false })
  verify: boolean;

  @Prop({ required: [true, 'Verify token is required'] })
  verificationToken: string;

  @ApiPropertyOptional()
  @Prop()
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
