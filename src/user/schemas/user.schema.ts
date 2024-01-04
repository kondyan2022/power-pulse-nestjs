import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  @Prop({ min: [150, 'Must be at least 150, got {VALUE}!'], required: true })
  height: number;

  @Prop({ min: [35, 'Must be at least 35, got {VALUE}!'], required: true })
  currentWeight: number;

  @Prop({ min: [35, 'Must be at least 35, got {VALUE}!'], required: true })
  desiredWeight: number;

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

  @Prop({
    enum: [1, 2, 3, 4],
    required: true,
  })
  blood: number;

  @Prop({
    enum: ['male', 'female'],
    required: true,
  })
  sex: string;

  @Prop({ enum: [1, 2, 3, 4, 5], required: true })
  levelActivity: number;

  @Prop({ default: 110 })
  DSN: number;

  BMR: number;
}

export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({
    min: [2, 'Minimum 2 symbol'],
    required: [true, 'Set name for user'],
  })
  name: string;

  @Prop({
    required: [true, 'Set password for user'],
  })
  password: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

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

  @Prop()
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
