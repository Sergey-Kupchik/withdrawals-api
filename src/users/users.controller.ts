import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateUserDto, FilterParamsDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IAllUsersOutput, IUserOutput } from './interfaces/user.interface';
import { Response } from 'express';
import { UsersQueryRepository } from './users.query.repository';

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

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const deleted = await this.usersQueryRepository.deleteById(id);
    if (deleted) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
