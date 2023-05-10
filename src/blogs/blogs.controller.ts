import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IExtendedPost } from 'src/posts/interfaces/post.interface';
import { PostsQueryRepository } from 'src/posts/posts.query.repository';
import { PostsService } from 'src/posts/posts.service';
import { FilterParamsDto } from 'src/utils/paginationParams';
import { BlogsQueryRepository } from './blogs.query.repository';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, CreatePostNoBlogIdDto } from './dto/blod.dto';
import { IAllBlogsOutput, IBlog } from './interfaces/blog.interface';
import { ParseObjectIdPipe } from '../validation/parse-objectId.pipe';
import { UserIdFromJwt } from '../auth/dto/current-userId.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller(`blogs`)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query() filterParamsDto: FilterParamsDto,
  ): Promise<IAllBlogsOutput> {
    return this.blogsQueryRepository.findAll(filterParamsDto);
  }

  @UseGuards(AuthGuard)
  @Get(':blogId/posts')
  async getPosts(
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
    @Param('blogId', ParseObjectIdPipe) blogId: string,
    @Query() filterParamsDto: FilterParamsDto,
  ) {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return await this.postsQueryRepository.findByBlogId(
      { blogId, userId },
      filterParamsDto,
    );
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<IBlog> {
    return this.blogsService.create(createBlogDto);
  }

  @Post(':blogId/posts')
  async createPost(
    @Param('blogId', ParseObjectIdPipe) blogId: string,
    @Body() createPostNoBlogIdDto: CreatePostNoBlogIdDto,
  ): Promise<IExtendedPost> {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return this.postsService.create({ ...createPostNoBlogIdDto, blogId });
  }
  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const blog = await this.blogsQueryRepository.findById(id);
    if (!blog) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return blog;
  }

  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    const isUpdated = await this.blogsService.update(createBlogDto, id);
    if (!isUpdated) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
    const deleted = await this.blogsQueryRepository.deleteById(id);
    if (!deleted) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }
}
