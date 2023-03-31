export class CreateCommentDto {
  postId: string;
  content: string;
}

export class CreateCommentUserInfoDto {
  userId: string;
  userLogin: string;
}
