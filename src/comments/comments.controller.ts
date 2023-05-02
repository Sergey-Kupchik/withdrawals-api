import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ParseObjectIdPipe } from '../validation/parse-objectId.pipe';
import { CreateLikeDto } from '../likes/dto/create-like-dto';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { Like } from '../schemas/like.schema';
import { LikeService } from '../likes/likes.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserIdDTO } from '../blogs/dto/blod.dto';

@Controller(`comments`)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly likeService: LikeService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() userIdDTO: UserIdDTO,
  ) {
    const comment = await this.commentsQueryRepository.findById(
      id,
      userIdDTO.userId,
    );
    if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return comment;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
    const deleted = await this.commentsQueryRepository.deleteById(id);
    if (!deleted) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }

  @HttpCode(204)
  @Put(':id/like-status')
  async likeComment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createLikeDto: CreateLikeDto,
  ) {
    // const comment = await this.commentsQueryRepository.findById(id);
    // if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    await this.likeService.likeDislikeComment({
      commentId: id,
      likeStatus: createLikeDto.likeStatus,
      userId: createLikeDto.userId,
    });
    return;
  }

  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    // const comment = await this.commentsQueryRepository.findById(id);
    // if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    await this.commentsService.updateById({
      commentId: id,
      content: createCommentDto.content,
    });
    return;
  }
}
