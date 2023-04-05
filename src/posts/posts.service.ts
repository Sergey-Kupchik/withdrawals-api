import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { Post, PostModelType } from '../schemas/post.schema';
import { CreatePostDto } from './dto/post.dto';
import { IExtendedPost, LikeStatusEnum } from './interfaces/post.interface';
import { PostsRepository } from './posts.repository';

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
        myStatus: LikeStatusEnum.None,
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

//
// async getAll(filterParamsDto: FilterParamsDto): Promise<IAllPostsOutput> {
//   const posts = {
//     page: filterParamsDto.pageNumber ? filterParamsDto.pageNumber : 1,
//     pageSize: filterParamsDto.pageSize ? filterParamsDto.pageSize : 10,
//     pagesCount: Math.ceil(
//       this.posts.length /
//         (filterParamsDto.pageSize ? filterParamsDto.pageSize : 10),
//     ),
//     totalCount: this.posts.length,
//     items: this.posts.map((post) => ({
//       id: post.id,
//       title: post.title,
//       shortDescription: post.shortDescription,
//       content: post.content,
//       blogId: post.blogId,
//       blogName: post.blogName,
//       createdAt: post.createdAt,
//       extendedLikesInfo: {
//         likesCount: 0,
//         dislikesCount: 0,
//         myStatus: LikeStatusEnum.None,
//         newestLikes: [],
//       },
//     })),
//   };
//   return posts;
// }
//   async deleteById(id: string): Promise<boolean> {
//     const post = this.posts.find((b) => b.id === id);
//     if (!post) return false;
//     const updatedPosts = this.posts.filter((b) => b.id !== id);
//     this.posts = updatedPosts as unknown as IPost[];
//     return true;
//   }
//   async deleteAll(id: string) {
//     this.posts = [];
//     return;
//   }
// }
// const blog: IBlog = {
//   id: uuidv4(),
//   name: createUserDto.name,
//   websiteUrl: createUserDto.websiteUrl,
//   createdAt: new Date().toISOString(),
//   description: createUserDto.description,
//   isMembership: true,
// };
// // const resp = await this.blogsRepository.create(blog)
// this.blogs.push(blog);
// // const resp = await this.blogsRepository.createBlog(blog)
// return await this.findById(blog.id);
//}
// async findById(id: string): Promise<IBlog | null> {
//   return this.blogs.find((b) => b.id === id);
// }
// async update(createUserDto: CreateBlogDto, id: string): Promise<boolean> {
//   // const result = await this.blogsRepository.updateBlog(createUserDto, id);
//   const blog4Update = this.blogs.find((b) => b.id === id);
//   if (!blog4Update) return false;
//   const updatedBlogs = this.blogs.map((b) => {
//     if (b.id === id) {
//       b.name = createUserDto.name ? createUserDto.name : b.name;
//       b.description = createUserDto.description
//         ? createUserDto.description
//         : b.description;
//       b.websiteUrl = createUserDto.websiteUrl
//         ? createUserDto.websiteUrl
//         : b.websiteUrl;
//     }
//     return b;
//   });
//   this.blogs = updatedBlogs as unknown as IBlog[];
//   return true;
// }
// async deleteById(id: string): Promise<boolean> {
//   // const result = await this.blogsRepository.deleteBlogById(id)
//   // return result;
//   const blog = this.blogs.find((b) => b.id === id);
//   if (!blog) return false;
//   const updatedBlogs = this.blogs.filter((b) => b.id !== id);
//   this.blogs = updatedBlogs as unknown as IBlog[];
//   return true;
// }
// async deleteAll(): Promise<boolean> {
//   this.blogs = [];
//   return true;
// }
// async getAll(filterParamsDto: FilterParamsDto): Promise<IAllBlogsOutput> {
//   const blogs = {
//     page: filterParamsDto.pageNumber ? filterParamsDto.pageNumber : 1,
//     pageSize: filterParamsDto.pageSize ? filterParamsDto.pageSize : 10,
//     pagesCount: Math.ceil(
//       this.blogs.length /
//         (filterParamsDto.pageSize ? filterParamsDto.pageSize : 10),
//     ),
//     totalCount: this.blogs.length,
//     items: this.blogs.map((b) => ({
//       id: b.id,
//       name: b.name,
//       websiteUrl: b.websiteUrl,
//       createdAt: b.createdAt,
//       description: b.description,
//       isMembership: b.isMembership,
//     })),
//   };
//   return blogs;
// }
// }
