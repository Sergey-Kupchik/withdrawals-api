import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.query.repository';
import { BlogQueryRepository } from '../blogs/blog.query.repository';

@Controller(`testing`)
export class TestingController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly blogsQueryRepository: BlogQueryRepository,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    await this.usersQueryRepository.deleteAll();
    await this.blogsQueryRepository.deleteAll();
    return;
  }
}
