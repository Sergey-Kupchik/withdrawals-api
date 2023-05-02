import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterParamsDto, PaginationParams } from 'src/utils/paginationParams';
import { Post, PostModelType } from '../schemas/post.schema';
import { IAllPostsOutput, IExtendedPost } from './interfaces/post.interface';
import { LikesQueryRepository } from '../likes/likes.query.repository';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async findAll(
    userId: string,
    filterDto: FilterParamsDto,
  ): Promise<IAllPostsOutput> {
    const params = new PaginationParams(filterDto);
    const totalCount: number = await this.postModel.find().count();
    const posts = await this.postModel
      .find()
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    const extendedPosts = await Promise.all(
      posts.map(
        async (p) => await this.findById({ postId: p.id, userId: userId }),
      ),
    );
    const postOutput: IAllPostsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: extendedPosts,
    };
    return postOutput;
  }
  async deleteById(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({
      _id: id,
    });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.postModel.deleteMany();
    return resultDoc.acknowledged;
  }
  async findById(dto: {
    userId: string;
    postId: string;
  }): Promise<IExtendedPost | null> {
    const post = await this.postModel
      .findOne({ _id: dto.postId }, '  -__v')
      .lean();
    if (!post) return null;
    const { likesCount, dislikesCount } =
      await this.likesQueryRepository.getLikesCount4Post(dto.postId);
    const newestLikes = await this.likesQueryRepository.getNewestLikes4Post(
      dto.postId,
    );
    const userLikestStatus =
      await this.likesQueryRepository.getPostLikeStatusByUserId(dto);
    if (post) {
      return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount,
          dislikesCount,
          myStatus: userLikestStatus,
          newestLikes,
        },
      };
    } else {
      return null;
    }
  }

  async findByBlogId(
    dto: { blogId: string; userId: string },
    filterDto: FilterParamsDto,
  ): Promise<IAllPostsOutput | null> {
    const params = new PaginationParams(filterDto);
    const filter = { blogId: dto.blogId };
    const totalCount: number = await this.postModel.find(filter).count();
    const items = await this.postModel
      .find(filter)
      .sort({ [params.sortBy]: params.sortDirectionNumber })
      .skip(params.skipItems)
      .limit(params.pageSize);
    const extendedPosts = await Promise.all(
      items.map(
        async (p) => await this.findById({ postId: p.id, userId: dto.userId }),
      ),
    );

    const postOutput: IAllPostsOutput = {
      pagesCount: params.getPageCount(totalCount),
      page: +params.pageNumber,
      pageSize: +params.pageSize,
      totalCount,
      items: extendedPosts as IExtendedPost[],
    };
    return postOutput;
  }
}
