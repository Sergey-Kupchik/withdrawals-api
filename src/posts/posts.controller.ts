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
import { ParseObjectIdPipe } from '../validation/parse-objectId.pipe';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentsService } from '../comments/comments.service';
import { IExtendedComment } from '../comments/interfaces/comment.interface';
import { CreateLikeDto } from '../likes/dto/create-like-dto';
import { LikeService } from '../likes/likes.service';
import { UserIdDTO } from '../blogs/dto/blod.dto';

@Controller(`posts`)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likeService: LikeService,
  ) {}

  @Get()
  async getPosts(
    @Body() userIdDTO: UserIdDTO,
    @Query() filterParamsDto: FilterParamsDto,
  ): Promise<IAllPostsOutput> {
    return this.postsQueryRepository.findAll(userIdDTO.userId, filterParamsDto);
  }
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }
  @Get(':id/comments')
  async getComments(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() userIdDTO: UserIdDTO,
    @Query() filterParamsDto: FilterParamsDto,
  ) {
    const comments = await this.commentsQueryRepository.findAllByPostId(
      filterParamsDto,
      id,
      userIdDTO.userId,
    );
    if (!comments) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return comments;
  }

  @Post(':id/comments')
  async createComment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Query() filterParamsDto: FilterParamsDto,
  ) {
    const comment = await this.commentsService.create(
      { content: createCommentDto.content, postId: id },
      createCommentDto.userId,
    );
    if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    const extendedComment = await this.commentsQueryRepository.findById(
      comment.id,
      createCommentDto.userId,
    );
    return extendedComment;
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Body() userIdDTO: UserIdDTO) {
    const post = await this.postsQueryRepository.findById({
      postId: id,
      userId: userIdDTO.userId,
    });
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

  @HttpCode(204)
  @Put(':id/like-status')
  async like(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CreateLikeDto,
  ) {
    // const post = await this.postsQueryRepository.findById(id);
    // if (!post) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    await this.likeService.likeDislikePost({
      postId: id,
      likeStatus: dto.likeStatus,
      userId: dto.userId,
    });
    return;
  }
}
