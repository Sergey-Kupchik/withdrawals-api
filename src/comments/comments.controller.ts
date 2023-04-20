import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { ParseObjectIdPipe } from '../validation/parse-objectId.pipe';

@Controller(`comments`)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return comment;
  }
}
