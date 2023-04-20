import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import {
  CreateCommentDto,
  CreateCommentExtended,
} from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { IComment } from './interfaces/comment.interface';
import { PostsQueryRepository } from '../posts/posts.query.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  async create(
    createCommentExtended: CreateCommentExtended,
  ): Promise<IComment | null> {
    const post = await this.postsQueryRepository.findById(
      createCommentExtended.postId,
    );
    if (!post) return null;
    const comment = await this.commentModel.createCustomComment(
      createCommentExtended,
      { userId: 'userId', userLogin: 'userLogin' },
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
  async findById(id: string): Promise<IComment | null> {
    return this.commentModel.findById(id);
  }
}
