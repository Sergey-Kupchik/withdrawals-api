import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '../schemas/like.schema';
import {
  ILike,
  ILikeCommentDto,
  ILikePostDto,
} from './interfaces/like.interface';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private likeModel: LikeModelType) {}

  async save(Like: LikeDocument): Promise<ILike> {
    return Like.save();
  }

  async findByUserId(userId: string): Promise<LikeDocument | null> {
    return this.likeModel.findOne({ userId: userId });
  }

  async likeComment(dto: ILikeCommentDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      { $push: { 'comments.like': dto.commentId } },
      { new: true },
    );
  }

  async dislikeComment(dto: ILikeCommentDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      { $push: { 'comments.dislike': dto.commentId } },
      { new: true },
    );
  }

  async removeCommentLike(dto: ILikeCommentDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      { $pull: { 'comments.like': { $in: [dto.commentId] } } },
    );
  }

  async removeCommentDislike(dto: ILikeCommentDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      { $pull: { 'comments.dislike': { $in: [dto.commentId] } } },
    );
  }
  async likePost(dto: ILikePostDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      {
        $push: {
          'posts.like': {
            postId: dto.postId,
            addedAt: new Date().toISOString(),
          },
        },
      },
      { new: true },
    );
  }

  async dislikePost(dto: ILikePostDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      { $push: { 'posts.dislike': dto.postId } },
      { new: true },
    );
  }

  async removePostLike(dto: ILikePostDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      {
        userId: dto.userId,
      },
      { $pull: { 'posts.like': { postId: { $in: [dto.postId] } } } },
    );
  }

  async removePostDislike(dto: ILikePostDto): Promise<LikeDocument> {
    return this.likeModel.findOneAndUpdate(
      { userId: dto.userId },
      { $pull: { 'posts.dislike': { $in: [dto.postId] } } },
    );
  }
}
