import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Delete,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { CommentsQueryRepository } from 'src/comments/comments.query.repository';
import { FilterParamsDto } from 'src/utils/paginationParams';
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
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }
  @Post(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Query() filterParamsDto: FilterParamsDto,
  ) {
    const comments = await this.commentsQueryRepository.findAllByPostId(
      filterParamsDto,
      id,
    );
    if (!comments) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return comments;
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    const post = await this.postsQueryRepository.findById(id);
    if (!post) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return post;
  }

  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() createPostDto: CreatePostDto) {
    const isUpdated = await this.postsService.update(createPostDto, id);
    if (!isUpdated) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.postsQueryRepository.deleteById(id);
    if (!deleted) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }
}
