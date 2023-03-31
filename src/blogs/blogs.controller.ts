import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { FilterParamsDto } from '../users/dto/create-user.dto';
import { BlogsService } from './blogs.service';
import { IAllBlogsOutput, IBlog } from './interfaces/blog.interface';
import { CreateBlogDto } from './dto/blod.dto';
import { Response } from 'express';
import { BlogQueryRepository } from './blog.query.repository';

@Controller(`blogs`)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query() filterParamsDto: FilterParamsDto,
  ): Promise<IAllBlogsOutput> {
    return this.blogsQueryRepository.findAll(filterParamsDto);
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<IBlog> {
    return this.blogsService.create(createBlogDto);
  }
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.blogsQueryRepository.findById(id);
    if (blog) {
      return res.send(blog);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() createBlogDto: CreateBlogDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.blogsService.update(createBlogDto, id);
    if (isUpdated) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const deleted = await this.blogsQueryRepository.deleteById(id);
    if (deleted) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
