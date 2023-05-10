import { IsEmail, IsString, Length } from 'class-validator';
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
}

export interface IAuthUser {
  email: string;
  login: string;
  userId: string;
}
