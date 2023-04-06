import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { CommentsService } from './comments.service';

@Controller(`comments`)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return comment;
  }
}
