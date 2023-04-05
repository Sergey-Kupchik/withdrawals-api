import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDto } from '../posts/dto/post.dto';

@Schema()
export class Post {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  static async createCustomPost(
    createPostDto: CreatePostDto,
    blogName: string,
    Model: PostModelType,
  ): Promise<PostDocument> {
    const postDto = {
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: createPostDto.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    return new Model(postDto);
  }
  async updatePost(createPostDto: CreatePostDto) {
    this.title = createPostDto.title;
    this.shortDescription = createPostDto.shortDescription;
    this.content = createPostDto.content;
    this.blogId = createPostDto.blogId;
  }
}

type PostModelStaticType = {
  createCustomPost: (
    createPostDto: CreatePostDto,
    blogName: string,
    Model: PostModelType,
  ) => Promise<PostDocument>;
};

type PostModelMethodsType = {
  updatePost: (createPostDto: CreatePostDto) => void;
};

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & PostModelStaticType;

PostSchema.methods = {
  updatePost: Post.prototype.updatePost,
} as PostModelMethodsType;

PostSchema.statics = {
  createCustomPost: Post.createCustomPost,
} as PostModelStaticType;
