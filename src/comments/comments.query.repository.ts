import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterParamsDto, PaginationParams } from 'src/utils/paginationParams';
import {
  IExtendedPost,
  LikeStatusEnum,
} from '../posts/interfaces/post.interface';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import {
  IAllCommentsOutput,
  IExtendedComment,
} from './interfaces/comment.interface';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.commentModel.deleteMany();
    return resultDoc.acknowledged;
  }

  async findAllByPostId(
    filterDto: FilterParamsDto,
    postId: string,
  ): Promise<IAllCommentsOutput | null> {
    const totalCount: number = await this.commentModel
      .find({ postId: postId })
      .count();
    const params = new PaginationParams(filterDto);
    const items = await this.commentModel
      .find({ postId: postId })
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    const postsOutput: IAllCommentsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: items.map((p) => ({
        id: p._id,
        content: p.content,
        commentatorInfo: { userLogin: p.userLogin, userId: p.userId },
        createdAt: p.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
        },
      })),
    };
    return postsOutput;
  }
  async findById(id: string): Promise<IExtendedComment | null> {
    const result = await this.commentModel
      .findOne({ _id: id }, '  -__v')
      .lean();
    if (result) {
      const comment: IExtendedComment = {
        id: result._id,
        content: result.content,
        commentatorInfo: { userLogin: result.userLogin, userId: result.userId },
        createdAt: result.createdAt,
        likesInfo: {
          likesCount: 12222222222222222,
          dislikesCount: 1222222222222222,
          myStatus: LikeStatusEnum.None,
        },
      };
      return comment;
    } else {
      return null;
    }
  }
}
