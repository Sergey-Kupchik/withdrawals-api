import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { IAuthUser, UserRegisterDto } from './dto/auth.dto';

const accessTokenLifeTime = '100000s';
const refreshTokenLifeTime = '200000s';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async signIn(dto: { loginOrEmail: string; password: string }): Promise<any> {
    const user = await this.usersService.checkCredentials(dto);
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.accountData.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async findUser(id: string): Promise<null | IAuthUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) return null;
    return {
      email: user.accountData.email,
      login: user.accountData.login,
      userId: user.accountData.id,
    };
  }
}
