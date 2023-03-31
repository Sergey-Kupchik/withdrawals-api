import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../blogs/dto/blod.dto';

@Schema()
export class Blog {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  isMembership: boolean;

  static async createCustomBlog(
    createBlogDto: CreateBlogDto,
    Model: BlogModelType,
  ): Promise<BlogDocument> {
    const blogDto = {
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    };
    return new Model(blogDto);
  }
  async updateBlog(createBlogDto: CreateBlogDto) {
    this.name = createBlogDto.name;
    this.websiteUrl = createBlogDto.websiteUrl;
    this.description = createBlogDto.description;
  }
}

type BlogModelStaticType = {
  createCustomBlog: (
    createBlogDto: CreateBlogDto,
    Model: BlogModelType,
  ) => Promise<BlogDocument>;
};

type BlogModelMethodsType = {
  updateBlog: (createBlogDto: CreateBlogDto) => void;
};

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
} as BlogModelMethodsType;

BlogSchema.statics = {
  createCustomBlog: Blog.createCustomBlog,
} as BlogModelStaticType;
