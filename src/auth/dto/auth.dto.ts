import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { AuthService } from '../auth.service';

export class SignInDto {
  @IsString()
  @Length(3, 30)
  loginOrEmail: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class UserRegisterDto {
  @IsString()
  @Length(3, 10)
  login: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export interface ILoginDto {
  password: string;
  loginOrEmail: string;
  clientIp: string;
  deviceTitle: string;
}

export interface IAuthUser {
  email: string;
  login: string;
  userId: string;
}

export interface ICheckCredentialsDto {
  password: string;
  loginOrEmail: string;
}
export interface ICreateRefreshToken {
  userId: string;
  clientIp: string;
  deviceTitle: string;
  deviceId: string;
  lastActiveDate: string;
}

export interface IRefreshTokenInfo {
  clientIp: string;
  deviceTitle: string;
  deviceId: string;
  lastActiveDate: string;
}

export interface IGetRefreshToken {
  userId: string;
  clientIp: string;
  deviceTitle: string;
}

export interface IUpdateRefreshToken {
  userId: string;
  clientIp: string;
  deviceId: string;
  lastActiveDate: string;
}

export interface IDeleteRefreshTokenDto {
  userId: string;
  deviceId: string;
}
