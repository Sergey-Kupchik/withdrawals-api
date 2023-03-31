import { Injectable } from '@nestjs/common';
import { IAllBlogsOutput, IBlog } from './interfaces/blog.interface';
import { CreateBlogDto } from './dto/blod.dto';
import { FilterParamsDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../schemas/blog.schema';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogsService {
  private blogs: IBlog[] = [];
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    private readonly blogRepository: BlogRepository,
  ) {}
  async create(createUserDto: CreateBlogDto): Promise<IBlog | null> {
    const blog = await this.blogModel.createCustomBlog(
      createUserDto,
      this.blogModel,
    );
    const savedBlog = await this.blogRepository.save(blog);
    return {
      id: savedBlog._id,
      name: savedBlog.name,
      description: savedBlog.description,
      websiteUrl: savedBlog.websiteUrl,
      createdAt: savedBlog.createdAt,
      isMembership: savedBlog.isMembership,
    };
  }
  async findById(id: string): Promise<IBlog | null> {
    return this.blogModel.findById(id);
  }
  async update(createUserDto: CreateBlogDto, id: string): Promise<boolean> {
    const blog = await this.blogModel.findById(id);
    if (!blog) return false;
    await blog.updateBlog(createUserDto);
    await this.blogRepository.save(blog);
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
