import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // private readonly catsService: CatsService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
  // @Get('cats')
  // getCats() {
  //   return this.catsService.findAll();
  // }
  //
  // @Post('cats')
  // postCats(@Body() createCatDto: CreateCatDto) {
  //   return this.catsService.create(createCatDto);
  // }
  // @Put('cats/:id')
  // updateAge(@Param('id') id: string, @Body() body: { age: number }) {
  //   return this.catsService.updateAge(id, body.age);
  // }
}
