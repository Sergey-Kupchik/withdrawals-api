import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TestingController } from './testing/testing.controller';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './schemas/cat.schema';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/cats', {}),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [
    AppController,
    UsersController,
    TestingController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    AppService,
    UsersService,
    BlogsService,
    PostsService,
    CommentsService,
    CatsService,
  ],
})
export class AppModule {}
