import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../schemas/like.schema';
import {
  ILikeDislikePostDto,
  ILikePostDto,
  ILikesCountType,
  INewestLikes,
  LikeStatusRepoEnum,
} from './interfaces/like.interface';
import { UsersQueryRepository } from '../users/users.query.repository';

@Injectable()
export class LikesQueryRepository {
  constructor(
    @InjectModel(Like.name) private likeModel: LikeModelType,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.likeModel.deleteMany();
    return resultDoc.acknowledged;
  }

  async getCommentLikeStatusByUserId(
    dto: getCommentStatusType,
  ): Promise<LikeStatusRepoEnum> {
    const likeInstance = await this.likeModel
      .findOne(
        { userId: dto.userId, 'comments.like': { $in: [dto.commentId] } },
        '-_id  -__v',
      )
      .lean();
    if (likeInstance) {
      return LikeStatusRepoEnum.Like;
    }
    const dislikeInstance = await this.likeModel
      .findOne(
        {
          userId: dto.userId,
          'comments.dislike': { $in: [dto.commentId] },
        },
        '-_id  -__v',
      )
      .lean();
    if (dislikeInstance) {
      return LikeStatusRepoEnum.Dislike;
    }
    return LikeStatusRepoEnum.None;
  }

  async getLikesCount4Comment(commentId: string): Promise<ILikesCountType> {
    const likesCount = await this.likeModel
      .findOne({ 'comments.like': { $in: [commentId] } }, '-_id  -__v')
      .count();
    const dislikesCount = await this.likeModel
      .findOne({ 'comments.dislike': { $in: [commentId] } }, '-_id  -__v')
      .count();
    return { likesCount, dislikesCount };
  }

  async getPostLikeStatusByUserId(
    dto: ILikePostDto,
  ): Promise<LikeStatusRepoEnum> {
    const likeInstance = await this.likeModel
      .findOne(
        {
          userId: dto.userId,
          'posts.like': { $elemMatch: { postId: dto.postId } },
        },
        '-_id  -__v',
      )
      .lean();
    if (likeInstance) {
      return LikeStatusRepoEnum.Like;
    }
    const dislikeInstance = await this.likeModel
      .findOne(
        {
          userId: dto.userId,
          'posts.dislike': { $in: [dto.postId] },
        },
        '-_id  -__v',
      )
      .lean();
    if (dislikeInstance) {
      return LikeStatusRepoEnum.Dislike;
    }
    return LikeStatusRepoEnum.None;
  }

  async getLikesCount4Post(postId: string): Promise<ILikesCountType> {
    const likesCount = await this.likeModel
      .findOne(
        { 'posts.like': { $elemMatch: { postId: postId } } },
        '-_id  -__v',
      )
      .count();
    const dislikesCount = await this.likeModel
      .findOne({ 'posts.dislike': { $in: [postId] } }, '-_id  -__v')
      .count();
    const countInfo = { likesCount, dislikesCount };
    return countInfo;
  }
  async getNewestLikes4Post(postId: string): Promise<INewestLikes[]> {
    const unfilteredUsers = await this.likeModel
      .find(
        { 'posts.like': { $elemMatch: { postId: postId } } },
        '-_id  -__v -posts.dislike -comments',
      )
      .lean();
    const filteredUsers = await Promise.all(
      unfilteredUsers
        .map((i) => {
          const selectedPost = i.posts.like.find((p) => p.postId === postId);
          const noLoginItem = {
            userId: i.userId,
            addedAt: selectedPost?.addedAt,
          };
          return noLoginItem;
        })
        .sort(
          (a, b) => (new Date(b.addedAt) as any) - (new Date(a.addedAt) as any),
        )
        .slice(0, 3)
        .map(async (e) => {
          const user = await this.usersQueryRepository.findById(e.userId);
          const loginItem = {
            addedAt: e.addedAt!,
            userId: e.userId!,
            login: user.login!,
          };
          return loginItem;
        }),
    );
    return filteredUsers;
  }
}

type getCommentStatusType = {
  userId: string;
  commentId: string;
};
