import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.query.repository';

@Controller(`testing`)
export class TestingController {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    await this.usersQueryRepository.deleteAll();
    return;
  }
}
