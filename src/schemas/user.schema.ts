import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

const emailConfirmationCodeLifeTimeHours = 5;

@Schema()
export class AccountData {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  id: string;
}

@Schema()
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ default: false })
  isConfirmed: boolean;
}

@Schema()
export class User {
  @Prop({ required: true, type: AccountData })
  accountData: AccountData;

  @Prop({ required: true, type: EmailConfirmation })
  emailConfirmation: EmailConfirmation;

  @Prop({ required: false })
  resetPasswordHash: string;

  @Prop({ required: false })
  resetPasswordExpires: string;

  static async createCustomUser(
    createUserDto: CreateUserDto,
    Model: UserModelType,
  ): Promise<UserDocument> {
    const userDto = {
      accountData: {
        login: createUserDto.login,
        email: createUserDto.email.toLowerCase(),
        hash: await bcrypt.hash(createUserDto.password, 10),
        createdAt: new Date().toISOString(),
        id: new Types.ObjectId(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: emailConfirmationCodeLifeTimeHours,
        }),
        isConfirmed: false,
      },
    };
    return new Model(userDto) as unknown as UserDocument;
  }
}

type UserModelStaticType = {
  createCustomUser: (
    createUserDto: CreateUserDto,
    Model: UserModelType,
  ) => Promise<UserDocument>;
};

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & UserModelStaticType;

UserSchema.statics = {
  createCustomUser: User.createCustomUser,
} as UserModelStaticType;
