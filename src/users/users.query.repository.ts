import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../schemas/user.schema';
import { FilterParamsDto, SortDirectionEnum } from './dto/create-user.dto';
import { IAllUsersOutput, IUserOutput } from './interfaces/user.interface';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async findAll(filterParamsDto: FilterParamsDto): Promise<IAllUsersOutput> {
    const searchLoginTerm = filterParamsDto.searchLoginTerm
      ? filterParamsDto.searchLoginTerm.toString()
      : null;
    const searchEmailTerm = filterParamsDto.searchEmailTerm
      ? filterParamsDto.searchEmailTerm.toString().toLowerCase()
      : null;
    const filter = filterParam(searchLoginTerm, searchEmailTerm);
    const totalCount: number = await this.userModel
      .find(filter, {
        projection: { _id: 0 },
      })
      .count();
    const pagesCount: number = Math.ceil(totalCount / filterParamsDto.pageSize);
    const sortDirectionParam =
      filterParamsDto.sortDirection === SortDirectionEnum.asc ? 1 : -1;
    const skipItems: number =
      (filterParamsDto.pageNumber - 1) * filterParamsDto.pageSize;
    const items = await this.userModel
      .find(filter, {
        projection: { _id: 0, hash: 0 },
      })
      .sort({ nameByStr: sortDirectionParam })
      .skip(skipItems)
      .limit(filterParamsDto.pageSize);
    const UsersOutput: IAllUsersOutput = {
      pagesCount,
      page: filterParamsDto.pageNumber,
      pageSize: filterParamsDto.pageSize,
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

function filterParam(
  searchLoginTerm: string | null,
  searchEmailTerm: string | null,
) {
  let param;
  if (searchLoginTerm && searchEmailTerm) {
    param = {
      $or: [
        { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
        { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
      ],
    };
  } else if (searchLoginTerm && !searchEmailTerm) {
    param = { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } };
  } else if (!searchLoginTerm && searchEmailTerm) {
    param = { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } };
  } else {
    param = {};
  }
  return param;
}
