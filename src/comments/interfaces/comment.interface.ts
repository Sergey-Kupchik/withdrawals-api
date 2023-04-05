import {
  ILikesInfo,
  LikeStatusEnum,
} from '../../posts/interfaces/post.interface';

export interface IComment {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  postId: string;
}

export interface IExtendedComment {
  id: string;
  content: string;
  commentatorInfo: { userLogin: string; userId: string };
  createdAt: string;
  likesInfo: ILikesInfoNoNewestLikes;
}

export interface IAllCommentsOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IExtendedComment[];
}

interface ILikesInfoNoNewestLikes {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
}
