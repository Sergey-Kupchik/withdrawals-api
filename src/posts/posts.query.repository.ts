import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterParamsDto,
  SortDirectionEnum,
} from '../users/dto/create-user.dto';
import { Post, PostModelType } from '../schemas/post.schema';
import {
  IAllPostsOutput,
  IExtendedPost,
  LikeStatusEnum,
} from './interfaces/post.interface';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async findAll(filterParamsDto: FilterParamsDto): Promise<IAllPostsOutput> {
    const searchLoginTerm = filterParamsDto.searchLoginTerm
      ? filterParamsDto.searchLoginTerm.toString()
      : null;
    const searchEmailTerm = filterParamsDto.searchEmailTerm
      ? filterParamsDto.searchEmailTerm.toString().toLowerCase()
      : null;
    const pageSize = filterParamsDto.pageSize ? filterParamsDto.pageSize : 10;
    const filter = filterParam(searchLoginTerm, searchEmailTerm);
    const totalCount: number = await this.postModel.find(filter).count();
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const sortDirectionParam =
      filterParamsDto.sortDirection === SortDirectionEnum.asc ? 1 : -1;
    const skipItems: number = (filterParamsDto.pageNumber - 1) * pageSize;
    const items = await this.postModel
      .find(filter)
      .sort({ nameByStr: sortDirectionParam })
      .skip(skipItems)
      .limit(pageSize);
    // to-do make a real call for getting real data about likes
    const postOutput: IAllPostsOutput = {
      pagesCount,
      page: filterParamsDto.pageNumber,
      pageSize: filterParamsDto.pageSize,
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
