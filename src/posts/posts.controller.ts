import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { PostsService } from './posts.service';
import { Response } from 'express';
import { FilterParamsDto } from '../users/dto/create-user.dto';
import { IAllPostsOutput } from './interfaces/post.interface';
import { CommentsService } from '../comments/comments.service';

@Controller(`posts`)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  async getUsers(@Query() request: FilterParamsDto): Promise<IAllPostsOutput> {
    return this.postsService.getAll(request);
  }

  @Post()
  async create(@Body() request: CreatePostDto, @Res() res: Response) {
    const post = await this.postsService.create(request);
    return res.send(post);
  }
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postsService.findById(id);
    if (post) {
      return res.send(post);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
  @Post(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Query() request: FilterParamsDto,
    @Res() res: Response,
  ) {
    const comments = await this.commentsService.findAllByPostId(request, id);
    if (comments) {
      return res.send(comments);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const deleted = await this.postsService.deleteById(id);
    if (deleted) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
