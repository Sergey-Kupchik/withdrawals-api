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

@Controller(`blogs`)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getUsers(@Query() request: FilterParamsDto): Promise<IAllBlogsOutput> {
    return this.blogsService.getAll(request);
  }

  @Post()
  async create(@Body() request: CreateBlogDto): Promise<IBlog> {
    return this.blogsService.create(request);
  }
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.blogsService.findById(id);
    if (blog) {
      return res.send(blog);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async createUser(
    @Param('id') id: string,
    @Body() request: CreateBlogDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.blogsService.update(request, id);
    if (isUpdated) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const deleted = await this.blogsService.deleteById(id);
    if (deleted) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
