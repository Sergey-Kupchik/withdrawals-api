import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  IAllCommentsOutput,
  IComment,
  IExtendedComment,
} from './interfaces/comment.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from '../users/users.service';
import { LikeStatusEnum } from '../posts/interfaces/post.interface';
import { PostsService } from '../posts/posts.service';
import { FilterParamsDto } from '../users/dto/create-user.dto';

@Injectable()
export class CommentsService {
  private comments: IComment[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<IComment> {
    const user = await this.usersService.findById(userId);
    const comment: IComment = {
      id: uuidv4(),
      content: createCommentDto.content,
      userId: userId,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
      postId: createCommentDto.postId,
    };
    this.comments.push(comment);
    const commentDb = await this.findByCommentId(comment.id);
    return commentDb;
  }

  async findByCommentId(id: string): Promise<IExtendedComment | null> {
    const comment = await this.comments.find((p) => p.id === id);
    if (!comment) return null;
    const extendedComment: IExtendedComment = {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      postId: comment.postId,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnum.None,
        newestLikes: [],
      },
    };
    return extendedComment;
  }

  async findAllByPostId(
    filterParamsDto: FilterParamsDto,
    postId: string,
  ): Promise<IAllCommentsOutput> {
    const comments = await this.comments.filter((p) => p.postId === postId);
    if (!comments) return null;

    const extendedComments: IAllCommentsOutput = {
      page: filterParamsDto.pageNumber ? filterParamsDto.pageNumber : 1,
      pageSize: filterParamsDto.pageSize ? filterParamsDto.pageSize : 10,
      pagesCount: Math.ceil(
        comments.length /
          (filterParamsDto.pageSize ? filterParamsDto.pageSize : 10),
      ),
      totalCount: comments.length,
      items: comments.map((c) => ({
        id: c.id,
        content: c.content,
        userId: c.userId,
        userLogin: c.userLogin,
        createdAt: c.createdAt,
        postId: c.postId,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
          newestLikes: [],
        },
      })),
    };
    return extendedComments;
  }
}
