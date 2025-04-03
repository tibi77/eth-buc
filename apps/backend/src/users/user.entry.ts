import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusValues, timezonesList, TStatus, TUserShapeNoId, TWorkingDays, TWorkingHours } from '@metavest/types/user';
import * as bcrypt from 'bcrypt';
import { Document, Types } from 'mongoose';
import { Role } from 'src/role/role.enum';
import { Complete } from 'src/utility';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }, toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.otp;
      delete ret.otp_expire_at;
      delete ret.otp_verified_at;
      return ret;
    }
  }
})
export class User implements Complete<TUserShapeNoId> {
  @Prop()
  _id: Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    set: (password: string) => bcrypt.hashSync(password, 10)
  })
  password: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  phone_number: string;

  @Prop()
  company_name: string;

  @Prop()
  company_address: string;

  @Prop({
    type: String,
    required: false
  })
  company_whatsapp_number: string;

  @Prop()
  company_tax_id: string;

  @Prop()
  otp: string;

  @Prop()
  otp_expire_at: string;

  @Prop({
    type: [String],
    enum: Role,
  })
  roles: Role[];

  @Prop({
    type: String,
    default: "inactive",
    required: true,
    enum: StatusValues
  })
  status: TStatus;

  @Prop({
    type: Date,
    default: Date.now()
  })
  otp_verified_at?: Date;

  @Prop({
    type: String,
    required: false
  })
  timezone: typeof timezonesList[number]['utc'][number];

  @Prop({
    type: String,
    required: false
  })
  week_days: TWorkingDays;

  @Prop({
    type: String,
    required: false
  })
  start_time: TWorkingHours;

  @Prop({
    type: String,
    required: false
  })
  end_time: TWorkingHours;
}

export const UserSchema = SchemaFactory.createForClass(User);
