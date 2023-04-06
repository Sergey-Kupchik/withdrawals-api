import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../schemas/blog.schema';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDto } from './dto/blod.dto';
import { IBlog } from './interfaces/blog.interface';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    private readonly blogRepository: BlogsRepository,
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
}
