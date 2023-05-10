import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Put,
  Query,
  Delete,
  HttpException,
  HttpCode,
  UseGuards,
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
import { AuthGuard } from '../auth/auth.guard';
import { UserIdFromJwt } from '../auth/dto/current-userId.decorator';

@Controller(`posts`)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likeService: LikeService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPosts(
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
    @Query() filterParamsDto: FilterParamsDto,
  ): Promise<IAllPostsOutput> {
    return this.postsQueryRepository.findAll(userId, filterParamsDto);
  }
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id/comments')
  async getComments(
    @Param('id', ParseObjectIdPipe) id: string,
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
    @Query() filterParamsDto: FilterParamsDto,
  ) {
    const comments = await this.commentsQueryRepository.findAllByPostId(
      filterParamsDto,
      id,
      userId,
    );
    if (!comments) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return comments;
  }

  @UseGuards(AuthGuard)
  @Post(':id/comments')
  async createComment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Query() filterParamsDto: FilterParamsDto,
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
  ) {
    const comment = await this.commentsService.create(
      { content: createCommentDto.content, postId: id },
      userId,
    );
    if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    const extendedComment = await this.commentsQueryRepository.findById({
      commentId: comment.id,
      userId,
    });
    return extendedComment;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
  ) {
    const post = await this.postsQueryRepository.findById({
      postId: id,
      userId: userId,
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

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async like(
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CreateLikeDto,
  ) {
    // const post = await this.postsQueryRepository.findById(id);
    // if (!post) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    await this.likeService.likeDislikePost({
      postId: id,
      likeStatus: dto.likeStatus,
      userId: userId,
    });
    return;
  }
}
