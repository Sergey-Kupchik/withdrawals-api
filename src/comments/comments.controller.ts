import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { CommentsService } from './comments.service';

@Controller(`comments`)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const comment = await this.commentsService.findByCommentId(id);
    if (comment) {
      return res.send(comment);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
