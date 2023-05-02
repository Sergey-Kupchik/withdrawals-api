import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { Post, PostModelType } from '../schemas/post.schema';
import { CreatePostDto } from './dto/post.dto';
import { IExtendedPost } from './interfaces/post.interface';
import { PostsRepository } from './posts.repository';
import { LikeStatusRepoEnum } from '../likes/interfaces/like.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<IExtendedPost> {
    const blog = await this.blogsQueryRepository.findById(createPostDto.blogId);
    const post = await this.postModel.createCustomPost(
      createPostDto,
      blog.name,
      this.postModel,
    );
    const savedComment = await this.postsRepository.save(post);
    return {
      id: savedComment._id,
      title: savedComment.title,
      shortDescription: savedComment.shortDescription,
      content: savedComment.content,
      blogId: savedComment.blogId,
      blogName: savedComment.blogName,
      createdAt: savedComment.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusRepoEnum.None,
        newestLikes: [],
      },
    };
  }
  async update(createPostDto: CreatePostDto, id: string): Promise<boolean> {
    const post = await this.postModel.findOne({ _id: id });
    if (!post) return false;
    await post.updatePost(createPostDto);
    await this.postsRepository.save(post);
    return true;
  }
}
