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
