import { Injectable } from '@nestjs/common';
import { ILike } from '../likes/interfaces/like.interface';

@Injectable()
export class LikeService {
  private likes: ILike[] = [];
  constructor() {
    // private readonly likesService: LikesService, // private readonly refreshTokensRepo: RefreshTokensRepo, // private readonly tokensService: TokensService, // private readonly usersRepository: UsersRepo,
  }
  async create(userId: string) {
    // const instance = await this.likesRepository.createInstance(userId)
    const instance: ILike = {
      userId: userId,
      comments: {
        like: [],
        dislike: [],
      },
      posts: {
        like: [],
        dislike: [],
      },
    };
    this.likes.push(instance);
    return;
  }
}
