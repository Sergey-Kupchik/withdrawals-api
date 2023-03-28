import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IAllBlogsOutput, IBlog } from './interfaces/blog.interface';
import { CreateBlogDto } from './dto/blod.dto';
import { FilterParamsDto } from '../users/dto/create-user.dto';

@Injectable()
export class BlogsService {
  private blogs: IBlog[] = [];
  constructor() {
    // private readonly likesService: LikesService, // private readonly refreshTokensRepo: RefreshTokensRepo, // private readonly tokensService: TokensService, // private readonly usersRepository: UsersRepo,
  }
  async create(createUserDto: CreateBlogDto): Promise<IBlog | null> {
    const blog: IBlog = {
      id: uuidv4(),
      name: createUserDto.name,
      websiteUrl: createUserDto.websiteUrl,
      createdAt: new Date().toISOString(),
      description: createUserDto.description,
      isMembership: true,
    };
    // const resp = await this.blogsRepository.create(blog)
    this.blogs.push(blog);
    // const resp = await this.blogsRepository.createBlog(blog)
    return await this.findById(blog.id);
  }
  async findById(id: string): Promise<IBlog | null> {
    return this.blogs.find((b) => b.id === id);
  }
  async update(createUserDto: CreateBlogDto, id: string): Promise<boolean> {
    // const result = await this.blogsRepository.updateBlog(createUserDto, id);
    const blog4Update = this.blogs.find((b) => b.id === id);
    if (!blog4Update) return false;
    const updatedBlogs = this.blogs.map((b) => {
      if (b.id === id) {
        b.name = createUserDto.name ? createUserDto.name : b.name;
        b.description = createUserDto.description
          ? createUserDto.description
          : b.description;
        b.websiteUrl = createUserDto.websiteUrl
          ? createUserDto.websiteUrl
          : b.websiteUrl;
      }
      return b;
    });
    this.blogs = updatedBlogs as unknown as IBlog[];
    return true;
  }
  async deleteById(id: string): Promise<boolean> {
    // const result = await this.blogsRepository.deleteBlogById(id)
    // return result;
    const blog = this.blogs.find((b) => b.id === id);
    if (!blog) return false;
    const updatedBlogs = this.blogs.filter((b) => b.id !== id);
    this.blogs = updatedBlogs as unknown as IBlog[];
    return true;
  }
  async deleteAll(): Promise<boolean> {
    this.blogs = [];
    return true;
  }
  async getAll(filterParamsDto: FilterParamsDto): Promise<IAllBlogsOutput> {
    const blogs = {
      page: filterParamsDto.pageNumber ? filterParamsDto.pageNumber : 1,
      pageSize: filterParamsDto.pageSize ? filterParamsDto.pageSize : 10,
      pagesCount: Math.ceil(
        this.blogs.length /
          (filterParamsDto.pageSize ? filterParamsDto.pageSize : 10),
      ),
      totalCount: this.blogs.length,
      items: this.blogs.map((b) => ({
        id: b.id,
        name: b.name,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        description: b.description,
        isMembership: b.isMembership,
      })),
    };
    return blogs;
  }
}
