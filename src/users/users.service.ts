import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  IAllUsersOutput,
  IEmailHashInfo,
  IUser,
  IUserOutput,
} from './interfaces/user.interface';
import bcrypt from 'bcrypt';
import { CreateUserDto, FilterParamsDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: IUser[] = [];
  constructor() {
    // private readonly likesService: LikesService, // private readonly refreshTokensRepo: RefreshTokensRepo, // private readonly tokensService: TokensService, // private readonly usersRepository: UsersRepo,
  }
  async create(createUserDto: CreateUserDto): Promise<IUserOutput | null> {
    const user: IUser = {
      accountData: {
        id: uuidv4(),
        login: createUserDto.login,
        email: createUserDto.email.toLowerCase(),
        hash: await this._hashPassword(createUserDto.password),
        createdAt: new Date().toISOString(),
        invalidRefreshTokens: [],
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: new Date('2023-09-25'),
        isConfirmed: false,
      },
    };
    // await this.usersRepository.createUser(newUser);
    this.users.push(user);
    // await this.likesService.createInstance(newUser.accountData.id)
    const userOutput = await this.findById(user.accountData.id);
    return userOutput;
  }

  async _hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async _comparePassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
  async findById(id: string): Promise<IUserOutput | null> {
    // const result = await this.usersRepository.findUserById(id);
    const result = this.users.find((u) => u.accountData.id === id);
    if (result) {
      const User: IUserOutput = {
        id: result.accountData.id,
        login: result.accountData.login,
        email: result.accountData.email,
        createdAt: result.accountData.createdAt,
      };
      return User;
    } else {
      return null;
    }
  }
  async findUserByResetPasswordHash(
    hash: string,
  ): Promise<IEmailHashInfo | null> {
    // const result = await this.usersRepository.findUserByPasswordRecoveryHashCode(hash);
    const result = this.users.find(
      (u) => u.accountData.resetPasswordHash === hash,
    );
    if (
      result &&
      result.accountData.resetPasswordHash &&
      result.accountData.resetPasswordExpires
    ) {
      const User: IEmailHashInfo = {
        id: result.accountData.id,
        login: result.accountData.login,
        email: result.accountData.email,
        createdAt: result.accountData.createdAt,
        resetPasswordHash: result.accountData.resetPasswordHash,
        resetPasswordExpires: result.accountData.resetPasswordExpires,
      };
      return User;
    } else {
      return null;
    }
  }
  async findUserByEmail(email: string): Promise<IUser | null> {
    // const user = await this.usersRepository.findUserByEmail(email.toLowerCase(),);
    const user = this.users.find((u) => u.accountData.email === email);
    return user;
  }
  async findUserByConfirmCode(code: string): Promise<IUser | null> {
    // const user = await this.usersRepository.findUserByConfirmationCode(code);
    const user = this.users.find(
      (u) => u.emailConfirmation.confirmationCode === code,
    );
    return user;
  }
  async findUserByLogin(login: string): Promise<IUser | null> {
    // const user = await this.usersRepository.findUserByLogin(login);
    const user = this.users.find((u) => u.accountData.login === login);
    return user;
  }
  async deleteUserById(id: string): Promise<boolean> {
    //const result = await this.usersRepository.deleteUserById(id);
    const user = await this.findById(id);
    if (!user) return false;
    const filteredUsers = this.users.filter((u) => u.accountData.id !== id);
    this.users = filteredUsers as unknown as IUser[];
    return (await this.findById(id)) === null ? true : false;
  }
  async confirmUser(id: string): Promise<boolean> {
    // const idConfirmed: boolean = await this.usersRepository.confirmUser(id);
    const idConfirmed = true;
    const updatedUsers = this.users.map((u) => {
      if (u.accountData.id === id) u.emailConfirmation.isConfirmed = true;
    });
    this.users = updatedUsers as unknown as IUser[];
    return idConfirmed;
  }
  async updateConfirmationCode(id: string): Promise<null> {
    const newData = {
      confirmationCode: uuidv4(),
      expirationDate: new Date('2024-09-25'),
      isConfirmed: false,
    };
    // const idUpdated: boolean =
    //   await this.usersRepository.updateConfirmationCode(id, newData);
    // if (idUpdated) return newData.confirmationCode;
    const updatedUsers = this.users.map((u) => {
      if (u.accountData.id === id) {
        u.emailConfirmation.confirmationCode = newData.confirmationCode;
        u.emailConfirmation.expirationDate = newData.expirationDate;
        u.emailConfirmation.isConfirmed = newData.isConfirmed;
      }
    });
    this.users = updatedUsers as unknown as IUser[];
    return null;
  }
  async getAll(filterParamsDto: FilterParamsDto): Promise<IAllUsersOutput> {
    // const user = await this.usersRepository.findUserByConfirmationCode(code);
    const allUsers = {
      pagesCount: Math.ceil(this.users.length / filterParamsDto.pageSize),
      page: filterParamsDto.pageNumber,
      pageSize: filterParamsDto.pageSize,
      totalCount: this.users.length,
      items: this.users.map((u) => ({
        id: u.accountData.id,
        login: u.accountData.login,
        email: u.accountData.email,
        createdAt: u.accountData.createdAt,
      })),
    };
    return allUsers;
  }
}
