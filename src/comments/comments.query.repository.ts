import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterParamsDto, PaginationParams } from 'src/utils/paginationParams';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import {
  IAllCommentsOutput,
  IExtendedComment,
} from './interfaces/comment.interface';
import { LikesQueryRepository } from '../likes/likes.query.repository';
import { LikeStatusRepoEnum } from '../likes/interfaces/like.interface';
import { UsersQueryRepository } from '../users/users.query.repository';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.commentModel.deleteMany();
    return resultDoc.acknowledged;
  }

  async findAllByPostId(
    filterDto: FilterParamsDto,
    postId: string,
    userId: string,
  ): Promise<IAllCommentsOutput | null> {
    const totalCount: number = await this.commentModel
      .find({ postId: postId })
      .count();
    const params = new PaginationParams(filterDto);
    const comment = await this.commentModel
      .find({ postId: postId })
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    const extendedPosts = await Promise.all(
      comment.map(async (p) => await this.findById(p.id, userId)),
    );
    const postsOutput: IAllCommentsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: extendedPosts,
    };
    return postsOutput;
  }
  async findById(id: string, userId: string): Promise<IExtendedComment | null> {
    const comment = await this.commentModel
      .findOne({ _id: id }, '  -__v')
      .lean();
    if (comment) {
      const { likesCount, dislikesCount } =
        await this.likesQueryRepository.getLikesCount4Comment(comment._id);
      const myStatus =
        await this.likesQueryRepository.getCommentLikeStatusByUserId({
          commentId: comment._id,
          userId: userId,
        });
      const userInfo = await this.usersQueryRepository.findById(userId);
      const commentOutput: IExtendedComment = {
        id: comment._id,
        content: comment.content,
        commentatorInfo: {
          userLogin: userInfo.login,
          userId: userInfo.id,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount,
          dislikesCount,
          myStatus,
        },
      };
      return commentOutput;
    } else {
      return null;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
