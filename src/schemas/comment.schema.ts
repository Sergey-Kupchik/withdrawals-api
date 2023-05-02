import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  CreateCommentDto,
  CreateCommentExtended,
  CreateCommentUserInfoDto,
} from '../comments/dto/create-comment.dto';

@Schema()
export class Comment {
  _id: string;
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  content: string;

  static async createCustomComment(
    createCommentExtended: CreateCommentExtended,
    userInfoDto: CreateCommentUserInfoDto,
    Model: CommentModelType,
  ): Promise<CommentDocument> {
    const commentDto = {
      content: createCommentExtended.content,
      userId: userInfoDto.userId,
      userLogin: userInfoDto.userLogin,
      createdAt: new Date().toISOString(),
      postId: createCommentExtended.postId,
    };
    return new Model(commentDto);
  }

  async updateComment(content: string) {
    this.content = content;
  }
}

type CommentModelStaticType = {
  createCustomComment: (
    createCommentDto: CreateCommentDto,
    userInfoDto: CreateCommentUserInfoDto,
    Model: CommentModelType,
  ) => Promise<CommentDocument>;
};

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & CommentModelStaticType;

type CommentModelMethodsType = {
  updateComment: (content: string) => void;
};

CommentSchema.statics = {
  createCustomComment: Comment.createCustomComment,
} as unknown as CommentModelStaticType;

CommentSchema.methods = {
  updateComment: Comment.prototype.updateComment,
} as CommentModelMethodsType;
