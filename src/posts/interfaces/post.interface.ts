import { IUserOutput } from '../../users/interfaces/user.interface';

export interface IPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface IAllPostsOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IExtendedPost[];
}

export interface IExtendedPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ILikesInfo;
}

export interface IPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}
export interface ILikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
  newestLikes: INewestLikes[];
}
export interface INewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}

export enum LikeStatusEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
export enum LikeDislikeEnum {
  Like = 'Like',
  Dislike = 'Dislike',
}
