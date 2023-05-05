import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../schemas/user.schema';

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
    return this.userModel
      .findOne({ 'accountData.email': email }, '-_id  -__v')
      .lean();
  }
  async findByLogin(login: string): Promise<User | null> {
    return this.userModel
      .findOne({ 'accountData.login': login }, '-_id  -__v')
      .lean();
  }
}
