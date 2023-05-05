import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserModelType } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserOutput } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';
import { LikeService } from '../likes/likes.service';
import { validateEmail } from '../utils/utils';
import { ILoginDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly likeService: LikeService,
    @InjectModel(User.name) private userModel: UserModelType,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IUserOutput> {
    const user = await this.userModel.createCustomUser(
      createUserDto,
      this.userModel,
    );
    const savedUser = await this.usersRepository.save(user);
    await this.likeService.create(savedUser.accountData.id);
    return {
      id: savedUser.accountData.id,
      login: savedUser.accountData.login,
      email: savedUser.accountData.email,
      createdAt: savedUser.accountData.createdAt,
    };
  }

  async _hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async _comparePassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
  async checkCredentials(dto: ILoginDto): Promise<User | null> {
    const user = validateEmail(dto.loginOrEmail)
      ? await this.usersRepository.findByEmail(dto.loginOrEmail)
      : await this.usersRepository.findByLogin(dto.loginOrEmail);
    if (user) {
      const isPasswordValid = await this._comparePassword(
        dto.password,
        user.accountData.hash,
      );
      if (isPasswordValid) return user;
    }
    return null;
  }
}
