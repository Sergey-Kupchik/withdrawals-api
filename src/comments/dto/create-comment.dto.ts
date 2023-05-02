import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(20, 300)
  content: string;

  @IsString()
  userId: string;
}

export class CreateCommentExtended {
  @IsString()
  postId: string;

  @IsString()
  @Length(20, 300)
  content: string;
}

export class CreateCommentUserInfoDto {
  userId: string;
  userLogin: string;
}
