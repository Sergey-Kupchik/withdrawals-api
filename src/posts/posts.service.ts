import { Injectable } from '@nestjs/common';
import {
  IAllPostsOutput,
  IExtendedPost,
  IPost,
  LikeStatusEnum,
} from './interfaces/post.interface';
import { CreatePostDto } from './dto/post.dto';
import { BlogsService } from '../blogs/blogs.service';
import { v4 as uuidv4 } from 'uuid';
import { FilterParamsDto } from '../users/dto/create-user.dto';
import { IBlog } from '../blogs/interfaces/blog.interface';

@Injectable()
export class PostsService {
  private posts: IPost[] = [];
  constructor(private readonly blogsService: BlogsService) {}
  async create(createPostDto: CreatePostDto): Promise<IExtendedPost> {
    const blog = await this.blogsService.findById(createPostDto.blogId);
    const post: IPost = {
      id: uuidv4(),
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: createPostDto.blogId,
      blogName: blog ? blog.name : 'No name',
      createdAt: new Date().toISOString(),
    };
    // const result = await this.postsRepository.createPost(post);
    this.posts.push(post);
    const extendedPost: IExtendedPost = {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnum.None,
        newestLikes: [],
      },
    };
    return extendedPost;
  }

  async findById(id: string): Promise<IExtendedPost | null> {
    const post = await this.posts.find((p) => p.id === id);
    // // const likesCount = await this.likesQueryRepository.getLikesCount4Post(postId)
    // // const newestLikest = await this.likesQueryRepository.getNewestLikes4Post(postId)
    // // const userLikestStatus = await this.likesQueryRepository.getPostLikeStatus4User(userId, postId)
    //  const likesCount = await this.likesQueryRepository.getLikesCount4Post(postId)

    return;
  }

  async getAll(filterParamsDto: FilterParamsDto): Promise<IAllPostsOutput> {
    const posts = {
      page: filterParamsDto.pageNumber ? filterParamsDto.pageNumber : 1,
      pageSize: filterParamsDto.pageSize ? filterParamsDto.pageSize : 10,
      pagesCount: Math.ceil(
        this.posts.length /
          (filterParamsDto.pageSize ? filterParamsDto.pageSize : 10),
      ),
      totalCount: this.posts.length,
      items: this.posts.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
          newestLikes: [],
        },
      })),
    };
    return posts;
  }
  async deleteById(id: string): Promise<boolean> {
    const post = this.posts.find((b) => b.id === id);
    if (!post) return false;
    const updatedPosts = this.posts.filter((b) => b.id !== id);
    this.posts = updatedPosts as unknown as IPost[];
    return true;
  }
  async deleteAll(id: string) {
    this.posts = [];
    return;
  }
}
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
