import { Injectable } from '@nestjs/common';
import { IUser, IUserOutput } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private users: IUser[] = [];
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectModel(User.name) private userModel: UserModelType,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IUserOutput> {
    const user = await this.userModel.createCustomUser(
      createUserDto,
      this.userModel,
    );
    const savedUser = await this.usersRepository.save(user);
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

  // async findUserByResetPasswordHash(
  //   hash: string,
  // ): Promise<IEmailHashInfo | null> {
  // const result = await this.usersRepository.findUserByPasswordRecoveryHashCode(hash);
  // const result = this.users.find(
  //   (u) => u.accountData.resetPasswordHash === hash,
  // );
  // if (
  //   result &&
  //   result.accountData.resetPasswordHash &&
  //   result.accountData.resetPasswordExpires
  // ) {
  //   const User: IEmailHashInfo = {
  //     id: result.accountData.id,
  //     login: result.accountData.login,
  //     email: result.accountData.email,
  //     createdAt: result.accountData.createdAt,
  //     resetPasswordHash: result.accountData.resetPasswordHash,
  //     resetPasswordExpires: result.accountData.resetPasswordExpires,
  //   };
  //   return User;
  // } else {
  // return null;
  // }
  // }
  // async findUserByEmail(email: string): Promise<IUser | null> {
  //   // const user = await this.usersRepository.findUserByEmail(email.toLowerCase(),);
  //   const user = this.users.find((u) => u.accountData.email === email);
  //   return user;
  // }
  // async findUserByConfirmCode(code: string): Promise<IUser | null> {
  //   // const user = await this.usersRepository.findUserByConfirmationCode(code);
  //   const user = this.users.find(
  //     (u) => u.emailConfirmation.confirmationCode === code,
  //   );
  //   return user;
  // }
  // async findUserByLogin(login: string): Promise<IUser | null> {
  //   // const user = await this.usersRepository.findUserByLogin(login);
  //   const user = this.users.find((u) => u.accountData.login === login);
  //   return user;
  // }
  // async deleteUserById(id: string): Promise<boolean> {
  //   //const result = await this.usersRepository.deleteUserById(id);
  //   const user = await this.findById(id);
  //   if (!user) return false;
  //   const filteredUsers = this.users.filter((u) => u.accountData.id !== id);
  //   this.users = filteredUsers as unknown as IUser[];
  //   return (await this.findById(id)) === null ? true : false;
  // }
  // async confirmUser(id: string): Promise<boolean> {
  //   // const idConfirmed: boolean = await this.usersRepository.confirmUser(id);
  //   const idConfirmed = true;
  //   const updatedUsers = this.users.map((u) => {
  //     if (u.accountData.id === id) u.emailConfirmation.isConfirmed = true;
  //   });
  //   this.users = updatedUsers as unknown as IUser[];
  //   return idConfirmed;
  // }
  // async updateConfirmationCode(id: string): Promise<null> {
  //   const newData = {
  //     confirmationCode: uuidv4(),
  //     expirationDate: new Date('2024-09-25'),
  //     isConfirmed: false,
  //   };
  // const idUpdated: boolean =
  //   await this.usersRepository.updateConfirmationCode(id, newData);
  // if (idUpdated) return newData.confirmationCode;
  //   const updatedUsers = this.users.map((u) => {
  //     if (u.accountData.id === id) {
  //       u.emailConfirmation.confirmationCode = newData.confirmationCode;
  //       u.emailConfirmation.expirationDate = newData.expirationDate;
  //       u.emailConfirmation.isConfirmed = newData.isConfirmed;
  //     }
  //   });
  //   this.users = updatedUsers as unknown as IUser[];
  //   return null;
  // }
}
