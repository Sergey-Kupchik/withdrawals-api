import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../schemas/comment.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

  async save(comment: CommentDocument): Promise<Comment> {
    return comment.save();
  }
}
