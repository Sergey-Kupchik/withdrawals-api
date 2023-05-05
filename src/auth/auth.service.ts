import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const accessTokenLifeTime = '100000s';
const refreshTokenLifeTime = '200000s';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: { loginOrEmail: string; password: string }): Promise<any> {
    const user = await this.usersService.checkCredentials(dto);
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.accountData.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
