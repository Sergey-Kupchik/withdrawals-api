import { Injectable } from '@nestjs/common';
import {
  ILike,
  ILikeDislikeCommentDto,
  ILikeDislikePostDto,
  LikeStatusRepoEnum,
} from '../likes/interfaces/like.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../schemas/like.schema';
import { LikesRepository } from './likes.repository';
import { LikesQueryRepository } from './likes.query.repository';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: LikeModelType,
    private readonly likesRepository: LikesRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async create(userId: string): Promise<ILike> {
    const likeInstance = await this.likeModel.createCustomLike(
      userId,
      this.likeModel,
    );
    const savedLikeInstance = await this.likesRepository.save(likeInstance);
    return savedLikeInstance;
  }
  async likeDislikeComment(dto: ILikeDislikeCommentDto): Promise<void> {
    const currentStatus =
      await this.likesQueryRepository.getCommentLikeStatusByUserId({
        userId: dto.userId,
        commentId: dto.commentId,
      });
    switch (dto.likeStatus) {
      case currentStatus:
        return;
      case LikeStatusRepoEnum.Like:
        await this.likesRepository.removeCommentDislike(dto);
        await this.likesRepository.likeComment(dto);
        return;
      case LikeStatusRepoEnum.Dislike:
        await this.likesRepository.removeCommentLike(dto);
        await this.likesRepository.dislikeComment(dto);
        return;
      case LikeStatusRepoEnum.None:
        await this.likesRepository.removeCommentLike(dto);
        await this.likesRepository.removeCommentDislike(dto);
        return;
    }
  }

  async likeDislikePost(dto: ILikeDislikePostDto): Promise<void> {
    const currentStatus =
      await this.likesQueryRepository.getPostLikeStatusByUserId({
        userId: dto.userId,
        postId: dto.postId,
      });
    switch (dto.likeStatus) {
      case currentStatus:
        return;
      case LikeStatusRepoEnum.Like:
        await this.likesRepository.removePostDislike({
          postId: dto.postId,
          userId: dto.userId,
        });
        await this.likesRepository.likePost({
          postId: dto.postId,
          userId: dto.userId,
        });
        return;
      case LikeStatusRepoEnum.Dislike:
        await this.likesRepository.removePostLike({
          postId: dto.postId,
          userId: dto.userId,
        });
        await this.likesRepository.dislikePost({
          postId: dto.postId,
          userId: dto.userId,
        });
        return;
      case LikeStatusRepoEnum.None:
        await this.likesRepository.removePostLike({
          postId: dto.postId,
          userId: dto.userId,
        });
        await this.likesRepository.removePostDislike({
          postId: dto.postId,
          userId: dto.userId,
        });
        return;
    }
  }
}
