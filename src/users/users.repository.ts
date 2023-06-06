import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../schemas/user.schema';
import { IEmailConfirmation } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async save(User: UserDocument): Promise<User> {
    return User.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel
      .findOne({ 'accountData.id': id }, '-_id  -__v')
      .lean();
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ 'accountData.email': email }, '-_id  -__v')
      .lean();
    return user;
  }
  async findByConfirmationCode(code: string): Promise<User | null> {
    return this.userModel
      .findOne({ 'emailConfirmation.confirmationCode': code }, '-_id  -__v')
      .lean();
  }
  async findByLogin(login: string): Promise<User | null> {
    return this.userModel
      .findOne({ 'accountData.login': login }, '-_id  -__v')
      .lean();
  }
  async addResetPasswordHash(dto: {
    userId: string;
    hash: string;
  }): Promise<boolean> {
    const user = await this.userModel.findOneAndUpdate(
      { 'accountData.id': dto.userId },
      {
        'accountData.resetPasswordHash': dto.hash,
      },
      { new: true },
    );
    return true;
  }
  async confirmUser(id: string): Promise<boolean> {
    const user = await this.userModel
      .findOneAndUpdate(
        { 'accountData.id': id },
        { 'emailConfirmation.isConfirmed': true },
        { new: true },
      )
      .lean();
    return user!.emailConfirmation.isConfirmed;
  }
  async updateConfirmationCode(
    id: string,
    emailConfirmation: IEmailConfirmation,
  ): Promise<boolean> {
    await this.userModel.findOneAndUpdate(
      { 'accountData.id': id },
      { emailConfirmation: emailConfirmation },
      { new: true },
    );
    return true;
  }
}
