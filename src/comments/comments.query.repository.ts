import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatusEnum } from '../posts/interfaces/post.interface';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import {
  FilterParamsDto,
  SortDirectionEnum,
} from '../users/dto/create-user.dto';
import { IAllCommentsOutput } from './interfaces/comment.interface';

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
    filterParamsDto: FilterParamsDto,
    postId: string,
  ): Promise<IAllCommentsOutput | null> {
    const pageSize = filterParamsDto.pageSize ? filterParamsDto.pageSize : 10;
    const totalCount: number = await this.commentModel
      .find({ postId: postId })
      .count();
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const sortDirectionParam =
      filterParamsDto.sortDirection === SortDirectionEnum.asc ? 1 : -1;
    const skipItems: number = (filterParamsDto.pageNumber - 1) * pageSize;
    const items = await this.commentModel
      .find({ postId: postId })
      .sort({ nameByStr: sortDirectionParam })
      .skip(skipItems)
      .limit(pageSize);
    const postsOutput: IAllCommentsOutput = {
      pagesCount,
      page: filterParamsDto.pageNumber,
      pageSize: filterParamsDto.pageSize,
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
}
