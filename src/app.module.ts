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
import { UsersRepository } from './users/users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UsersQueryRepository } from './users/users.query.repository';
import { BlogsRepository } from './blogs/blogs.repository';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsRepository } from './comments/comments.repository';
import { CommentsQueryRepository } from './comments/comments.query.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
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
    UsersRepository,
    UsersQueryRepository,
    BlogsRepository,
    BlogsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
  ],
})
export class AppModule {}
