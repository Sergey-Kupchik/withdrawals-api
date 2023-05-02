import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Like {
  @Prop({ unique: true })
  userId: string;

  @Prop({ type: { like: [String], dislike: [String] } })
  comments: {
    like: [string];
    dislike: [string];
  };

  @Prop({
    type: { like: [{ postId: String, addedAt: String }], dislike: [String] },
  })
  posts: {
    like: [{ postId: string; addedAt: string }];
    dislike: [string];
  };

  static async createCustomLike(
    userId: string,
    Model: LikeModelType,
  ): Promise<LikeDocument> {
    const likeDto = {
      userId: userId,
      comments: { like: [], dislike: [] },
      posts: { like: [], dislike: [] },
    };
    return new Model(likeDto) as unknown as LikeDocument;
  }
}

type LikeModelStaticType = {
  createCustomLike: (
    userId: string,
    Model: LikeModelType,
  ) => Promise<LikeDocument>;
};

export const LikeSchema = SchemaFactory.createForClass(Like);

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LikeDocument> & LikeModelStaticType;

LikeSchema.statics = {
  createCustomLike: Like.createCustomLike,
} as LikeModelStaticType;
