import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../schemas/comment.schema';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.commentModel.deleteMany();
    return resultDoc.acknowledged;
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
