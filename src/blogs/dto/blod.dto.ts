export class CreateBlogDto {
  name: string;
  websiteUrl: string;
  description: string;
}

export class CreatePostNoBlogIdDto {
  title: string;
  shortDescription: string;
  content: string;
}
