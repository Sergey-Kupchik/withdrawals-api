import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CatsService, CreateCatDto } from './cats/cats.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) {}

  @Get()
  getHello() {
    return this.catsService.findAll();
  }

  @Post()
  postHello(@Req() request: CreateCatDto) {
    return this.catsService.create(request);
  }
}
