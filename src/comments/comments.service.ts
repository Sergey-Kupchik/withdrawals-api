import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import { CreateCommentExtended } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { IComment } from './interfaces/comment.interface';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { UsersQueryRepository } from '../users/users.query.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  async create(
    createCommentExtended: CreateCommentExtended,
    userId: string,
  ): Promise<IComment | null> {
    const post = await this.postsQueryRepository.findById({
      postId: createCommentExtended.postId,
      userId: userId,
    });
    if (!post) return null;
    const { login } = await this.usersQueryRepository.findById(userId);
    if (!login) return null;
    const comment = await this.commentModel.createCustomComment(
      { ...createCommentExtended },
      { userId: userId, userLogin: login },
      this.commentModel,
    );
    const savedComment = await this.commentsRepository.save(comment);
    return {
      id: savedComment._id,
      userId: savedComment.userId,
      userLogin: savedComment.userLogin,
      postId: savedComment.postId,
      createdAt: savedComment.createdAt,
      content: savedComment.content,
    };
  }

  async updateById(dto: {
    commentId: string;
    content: string;
  }): Promise<boolean> {
    const comment = await this.commentModel.findById(dto.commentId);
    if (!comment) return false;
    await comment.updateComment(dto.content);
    await this.commentsRepository.save(comment);
    return true;
  }
}
