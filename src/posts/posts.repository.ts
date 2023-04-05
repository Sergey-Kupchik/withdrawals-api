import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../schemas/post.schema';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private blogModel: PostModelType) {}

  async save(Post: PostDocument): Promise<Post> {
    return Post.save();
  }
}
