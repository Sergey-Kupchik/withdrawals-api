export interface ILike {
  userId: string;
  comments: {
    like: Array<string>;
    dislike: Array<string>;
  };
  posts: {
    like: Array<{
      postId: string;
      addedAt: string;
    }>;
    dislike: Array<string>;
  };
}

export enum LikeStatusRepoEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export interface ILikesCountType {
  likesCount: number;
  dislikesCount: number;
}

export interface ILikeCommentDto {
  userId: string;
  commentId: string;
}

export interface ILikePostDto {
  userId: string;
  postId: string;
}

export interface ILikeDislikePostDto {
  postId: string;
  userId: string;
  likeStatus: LikeStatusRepoEnum;
}

export interface ILikeDislikeCommentDto {
  commentId: string;
  userId: string;
  likeStatus: LikeStatusRepoEnum;
}

export interface INewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}
