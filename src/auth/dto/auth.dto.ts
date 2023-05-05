import { IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(3, 30)
  loginOrEmail: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export interface ILoginDto {
  password: string;
  loginOrEmail: string;
}
