import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterParamsDto, PaginationParams } from 'src/utils/paginationParams';
import { Blog, BlogModelType } from '../schemas/blog.schema';
import { IAllBlogsOutput, IBlog } from './interfaces/blog.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findAll(filterDto: FilterParamsDto): Promise<IAllBlogsOutput> {
    const params = new PaginationParams(filterDto);
    const filterParam = params.searchNameTerm
      ? { name: { $regex: params.searchNameTerm, $options: 'i' } }
      : {};
    const totalCount: number = await this.blogModel.find(filterParam).count();
    const items = await this.blogModel
      .find(filterParam)
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    const BlogsOutput: IAllBlogsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
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
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return null;
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
