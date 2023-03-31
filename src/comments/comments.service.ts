import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { IComment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private readonly commentsRepository: CommentsRepository,
  ) {}
  async create(createCommentDto: CreateCommentDto): Promise<IComment | null> {
    const comment = await this.commentModel.createCustomComment(
      createCommentDto,
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
