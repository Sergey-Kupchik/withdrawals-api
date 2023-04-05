import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { CommentsQueryRepository } from 'src/comments/comments.query.repository';
import { FilterParamsDto } from '../users/dto/create-user.dto';
import { CreatePostDto } from './dto/post.dto';
import { IAllPostsOutput } from './interfaces/post.interface';
import { PostsQueryRepository } from './posts.query.repository';
import { PostsService } from './posts.service';

@Controller(`posts`)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getPosts(
    @Query() filterParamsDto: FilterParamsDto,
  ): Promise<IAllPostsOutput> {
    return this.postsQueryRepository.findAll(filterParamsDto);
  }
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
    const post = await this.postsService.create(createPostDto);
    return res.send(post);
  }
  @Post(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Query() filterParamsDto: FilterParamsDto,
    @Res() res: Response,
  ) {
    const comments = await this.commentsQueryRepository.findAllByPostId(
      filterParamsDto,
      id,
    );
    if (comments) {
      return res.send(comments);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postsQueryRepository.findById(id);
    if (post) {
      return res.send(post);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
    @Res() res: Response,
  ) {
    const isUpdated = await this.postsService.update(createPostDto, id);
    if (isUpdated) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const deleted = await this.postsQueryRepository.deleteById(id);
    if (deleted) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
