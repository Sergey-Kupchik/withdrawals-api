import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto, FilterParamsDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IAllUsersOutput, IUserOutput } from './interfaces/user.interface';
import { Response } from 'express';

@Controller(`users`)
export class UsersController {
  constructor(private readonly userService: UsersService) {
    //    private readonly  blogsService: BlogsService // private readonly  blogsQueryRepository: BlogsQueryRepository //   private readonly  postsService: CommentsService // private readonly  postsQueryRepository: PostsQueryRepo
  }

  @Get()
  async getUsers(@Query() request: FilterParamsDto): Promise<IAllUsersOutput> {
    return this.userService.getAll(request);
  }

  @Post()
  async createUser(@Body() request: CreateUserDto): Promise<IUserOutput> {
    return this.userService.create(request);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const deleted = await this.userService.deleteUserById(id);
    if (deleted) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
