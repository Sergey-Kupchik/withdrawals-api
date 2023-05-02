import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { PostsRepository } from './posts/posts.repository';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { Like, LikeSchema } from './schemas/like.schema';
import { LikeService } from './likes/likes.service';
import { LikesRepository } from './likes/likes.repository';
import { LikesQueryRepository } from './likes/likes.query.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
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
    PostsRepository,
    PostsQueryRepository,
    LikeService,
    LikesRepository,
    LikesQueryRepository,
  ],
})
export class AppModule {}
