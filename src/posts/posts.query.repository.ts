import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterParamsDto, PaginationParams } from 'src/utils/paginationParams';
import { Post, PostModelType } from '../schemas/post.schema';

import {
  IAllPostsOutput,
  IExtendedPost,
  LikeStatusEnum,
} from './interfaces/post.interface';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async findAll(filterDto: FilterParamsDto): Promise<IAllPostsOutput> {
    const params = new PaginationParams(filterDto);
    const totalCount: number = await this.postModel.find().count();
    const items = await this.postModel
      .find()
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    // to-do make a real call for getting real data about likes
    const postOutput: IAllPostsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: items.map((p) => ({
        id: p._id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
          newestLikes: [],
        },
      })),
    };
    return postOutput;
  }
  async deleteById(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({
      _id: id,
    });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.postModel.deleteMany();
    return resultDoc.acknowledged;
  }
  async findById(id: string): Promise<IExtendedPost | null> {
    const result = await this.postModel.findOne({ _id: id }, '  -__v').lean();
    if (result) {
      const post: IExtendedPost = {
        id: result._id,
        title: result.title,
        shortDescription: result.shortDescription,
        content: result.content,
        blogId: result.blogId,
        blogName: result.blogName,
        createdAt: result.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
          newestLikes: [],
        },
      };
      return post;
    } else {
      return null;
    }
  }

  async findByBlogId(
    blogId: string,
    filterDto: FilterParamsDto,
  ): Promise<IAllPostsOutput | null> {
    const params = new PaginationParams(filterDto);
    const filter = { blogId: blogId };
    const totalCount: number = await this.postModel.find(filter).count();
    const items = await this.postModel
      .find(filter)
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);

    const postOutput: IAllPostsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: items.map((p) => ({
        id: p._id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
          newestLikes: [],
        },
      })),
    };
    return postOutput;
  }
}
