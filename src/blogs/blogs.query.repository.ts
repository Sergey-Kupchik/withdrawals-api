import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../schemas/blog.schema';
import {
  FilterParamsDto,
  SortDirectionEnum,
} from '../users/dto/create-user.dto';
import { IAllBlogsOutput, IBlog } from './interfaces/blog.interface';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findAll(filterParamsDto: FilterParamsDto): Promise<IAllBlogsOutput> {
    const searchLoginTerm = filterParamsDto.searchLoginTerm
      ? filterParamsDto.searchLoginTerm.toString()
      : null;
    const searchEmailTerm = filterParamsDto.searchEmailTerm
      ? filterParamsDto.searchEmailTerm.toString().toLowerCase()
      : null;
    const pageSize = filterParamsDto.pageSize ? filterParamsDto.pageSize : 10;
    const filter = filterParam(searchLoginTerm, searchEmailTerm);
    const totalCount: number = await this.blogModel.find(filter).count();
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const sortDirectionParam =
      filterParamsDto.sortDirection === SortDirectionEnum.asc ? 1 : -1;
    const skipItems: number = (filterParamsDto.pageNumber - 1) * pageSize;
    const items = await this.blogModel
      .find(filter)
      .sort({ nameByStr: sortDirectionParam })
      .skip(skipItems)
      .limit(pageSize);
    const BlogsOutput: IAllBlogsOutput = {
      pagesCount,
      page: filterParamsDto.pageNumber,
      pageSize: filterParamsDto.pageSize,
      totalCount,
      items: items.map((b) => ({
        id: b._id,
        name: b.name,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        description: b.description,
        isMembership: b.isMembership,
      })),
    };
    return BlogsOutput;
  }
  async deleteById(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({
      _id: id,
    });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.blogModel.deleteMany();
    return resultDoc.acknowledged;
  }
  async findById(id: string): Promise<IBlog | null> {
    const result = await this.blogModel.findOne({ _id: id }, '  -__v').lean();
    if (result) {
      const blog: IBlog = {
        id: result._id,
        name: result.name,
        websiteUrl: result.websiteUrl,
        createdAt: result.createdAt,
        description: result.description,
        isMembership: result.isMembership,
      };
      return blog;
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
