import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterParamsDto, PaginationParams } from 'src/utils/paginationParams';
import { User, UserModelType } from '../schemas/user.schema';
import { IAllUsersOutput, IUserOutput } from './interfaces/user.interface';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async findAll(filterParamsDto: FilterParamsDto): Promise<IAllUsersOutput> {
    const params = new PaginationParams(filterParamsDto);
    const filter = params.filterByLoginOrEmail();
    const nameByStr = `accountData.${params.sortBy}`;
    const totalCount: number = await this.userModel.find(filter).count();
    const items = await this.userModel
      .find(filter, {
        projection: { _id: 0, hash: 0 },
      })
      .sort({ [nameByStr]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    const UsersOutput: IAllUsersOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: items.map((u) => ({
        id: u.accountData.id,
        login: u.accountData.login,
        email: u.accountData.email,
        createdAt: u.accountData.createdAt,
      })),
    };
    return UsersOutput;
  }
  async deleteById(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ 'accountData.id': id });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.userModel.deleteMany();
    return resultDoc.acknowledged;
  }
  async findById(id: string): Promise<IUserOutput | null> {
    const result = await this.userModel
      .findOne({ 'accountData.id': id }, '-_id  -__v')
      .lean();
    if (result) {
      const User: IUserOutput = {
        id: result.accountData.id,
        login: result.accountData.login,
        email: result.accountData.email,
        createdAt: result.accountData.createdAt,
      };
      return User;
    } else {
      return null;
    }
  }
}
