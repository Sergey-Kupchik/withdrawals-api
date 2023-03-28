import { ILikesInfo } from '../../posts/interfaces/post.interface';
import { IBlog } from '../../blogs/interfaces/blog.interface';

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
  userId: string;
  userLogin: string;
  createdAt: string;
  postId: string;
  extendedLikesInfo: ILikesInfo;
}

export interface IAllCommentsOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IExtendedComment[];
}
