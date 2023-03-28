import { Controller, Delete, HttpCode } from '@nestjs/common';

@Controller(`testing`)
export class TestingController {
  constructor() {
    //    private readonly  blogsService: BlogsService // private readonly  blogsQueryRepository: BlogsQueryRepository //   private readonly  postsService: CommentsService // private readonly  postsQueryRepository: PostsQueryRepo
  }

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    // const deleted = await this.userService.deleteUserById(id);
    return;
  }
}
