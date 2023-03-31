import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../schemas/blog.schema';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async save(Blog: BlogDocument): Promise<Blog> {
    return Blog.save();
  }
}
