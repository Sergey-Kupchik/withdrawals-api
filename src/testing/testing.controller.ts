import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.query.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { PostsQueryRepository } from 'src/posts/posts.query.repository';
// import { ConfigService } from '@nestjs/config';

@Controller(`testing`)
export class TestingController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository, // private readonly configService: ConfigService
  ) {}

  // private jwtSercet = this.configService.get('JWT_SECRET')

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    await this.usersQueryRepository.deleteAll();
    await this.blogsQueryRepository.deleteAll();
    await this.commentsQueryRepository.deleteAll();
    await this.postsQueryRepository.deleteAll();
    return;
  }
}
