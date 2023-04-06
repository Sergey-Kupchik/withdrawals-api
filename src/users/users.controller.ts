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
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IAllUsersOutput, IUserOutput } from './interfaces/user.interface';
import { UsersQueryRepository } from './users.query.repository';
import { FilterParamsDto } from 'src/utils/paginationParams';

@Controller(`users`)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(
    @Query() filterParams: FilterParamsDto,
  ): Promise<IAllUsersOutput> {
    return this.usersQueryRepository.findAll(filterParams);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUserOutput> {
    return this.userService.create(createUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.usersQueryRepository.deleteById(id);
    if (!deleted) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }
}
