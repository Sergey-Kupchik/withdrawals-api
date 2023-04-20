import { IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MaxLength(15)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(100)
  @IsUrl()
  websiteUrl: string;
}

export class CreatePostNoBlogIdDto {
  title: string;
  shortDescription: string;
  content: string;
}
