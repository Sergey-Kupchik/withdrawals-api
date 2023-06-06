import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserModelType } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserOutput } from './interfaces/user.interface';
import { UsersRepository } from './users.repository';
import { LikeService } from '../likes/likes.service';
import { validateEmail } from '../utils/utils';
import { ICheckCredentialsDto, ILoginDto } from '../auth/dto/auth.dto';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  RefreshTokensInfo,
  RefreshTokensInfoModelType,
} from '../schemas/refresh-token-info.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly likeService: LikeService,
    @InjectModel(User.name) private userModel: UserModelType,
    @InjectModel(RefreshTokensInfo.name)
    private refreshTokensInfoModel: RefreshTokensInfoModelType,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IUserOutput> {
    const user = await this.userModel.createCustomUser(
      createUserDto,
      this.userModel,
    );
    const savedUser = await this.usersRepository.save(user);
    await this.likeService.create(savedUser.accountData.id);
    await this.refreshTokensInfoModel.createCustomItem(
      savedUser.accountData.id,
      this.refreshTokensInfoModel,
    );
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
  async confirmUser(userId: string): Promise<boolean> {
    const idConfirmed: boolean = await this.usersRepository.confirmUser(userId);
    return idConfirmed;
  }
  async findByLoginOrEmail(dto: ICheckCredentialsDto): Promise<User | null> {
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
  async updateConfirmationCode(id: string): Promise<string | null> {
    const emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 5,
      }),
      isConfirmed: false,
    };
    const idUpdated: boolean =
      await this.usersRepository.updateConfirmationCode(id, emailConfirmation);
    if (idUpdated) return emailConfirmation.confirmationCode;
    return null;
  }
  async resetPassword(email: string, recoverCode: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return false;
    const hash = await this._hashPassword(recoverCode);
    await this.usersRepository.addResetPasswordHash({
      userId: user.accountData.id,
      hash,
    });
    return true;
  }
}
