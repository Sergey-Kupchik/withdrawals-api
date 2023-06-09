import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import {
  IAuthUser,
  ICreateRefreshToken,
  IDeleteRefreshTokenDto,
  IGetRefreshToken,
  ILoginDto,
  IUpdateRefreshToken,
} from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { IRefreshTokenPayloadOutput } from './interfaces/refresh-token-Info.interface';
import { AuthRepository } from './auth.repository';
import {
  accessTokenLifeTime,
  accessTokenSecret,
  refreshTokenLifeTime,
} from './constants';
import {
  RefreshTokensInfo,
  RefreshTokensInfoModelType,
} from '../schemas/refresh-token-info.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
    @InjectModel(RefreshTokensInfo.name)
    private refreshTokensInfoModel: RefreshTokensInfoModelType,
  ) {}

  async signIn(dto: ILoginDto): Promise<any> {
    const user = await this.usersService.findByLoginOrEmail({
      loginOrEmail: dto.loginOrEmail,
      password: dto.password,
    });
    if (!user) throw new UnauthorizedException();
    const tokens = await this.getTokens({
      userId: user.accountData.id,
      clientIp: dto.clientIp,
      deviceTitle: dto.deviceTitle,
    });
    return tokens;
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

  async getTokens(dto: IGetRefreshToken) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: dto.userId,
        },
        {
          secret: accessTokenSecret,
          expiresIn: accessTokenLifeTime,
        },
      ),
      await this.getRefreshToken(dto),
      // this.jwtService.signAsync(
      //   {
      //     sub: dto.userId,
      //     deviceId: deviceInfo.deviceId,
      //     lastActiveDate: deviceInfo.lastActiveDate,
      //   },
      //   {
      //     secret: refreshTokenSecret,
      //     expiresIn: refreshTokenLifeTime,
      //   },
      // ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async getRefreshToken(dto: IGetRefreshToken): Promise<string> {
    const tokensByUserId = await this.findRefreshTokensByUserId(dto.userId);
    const issuedAt = new Date().toISOString();
    if (!tokensByUserId) {
      throw new UnauthorizedException();
    }
    const token = tokensByUserId?.find(
      (t) => t.ip === dto.clientIp && t.title === dto.deviceTitle,
    );
    if (token) {
      return this._updateRefreshToken({
        userId: dto.userId,
        deviceId: token.deviceId,
        clientIp: dto.clientIp,
        lastActiveDate: issuedAt,
      });
    } else {
      return await this._creatRefreshToken(dto);
      return this.jwtService.signAsync({
        sub: dto.userId,
        deviceId: 'token.deviceId',
        lastActiveDate: issuedAt,
      });
    }
  }

  async _updateRefreshToken(dto: IUpdateRefreshToken): Promise<string> {
    await this.authRepository.updateRefreshTokenInfo({
      userId: dto.userId,
      clientIp: dto.clientIp,
      deviceId: dto.deviceId,
      lastActiveDate: dto.lastActiveDate,
    });
    return this.jwtService.signAsync({
      sub: dto.userId,
      deviceId: dto.deviceId,
      lastActiveDate: dto.lastActiveDate,
    });
  }

  async _creatRefreshToken(dto: IGetRefreshToken): Promise<string> {
    const deviceId = uuidv4();
    const issuedAt = new Date().toISOString();
    await this.authRepository.createRefreshTokenInfo(dto.userId, {
      deviceId: deviceId,
      lastActiveDate: issuedAt,
      ip: dto.clientIp,
      title: dto.deviceTitle,
      expiresIn: refreshTokenLifeTime,
    });
    return this.jwtService.signAsync({
      sub: dto.userId,
      deviceId: deviceId,
      lastActiveDate: issuedAt,
    });
  }

  async findRefreshTokensByUserId(
    userId: string,
  ): Promise<IRefreshTokenPayloadOutput[]> {
    const tokensInfo = await this.authRepository.findRefreshTokensByUserId(
      userId,
    );
    if (!tokensInfo) return null;
    const tokensInfoOutput = tokensInfo.map((t) => ({
      deviceId: t.deviceId,
      lastActiveDate: t.lastActiveDate,
      ip: t.ip,
      title: t.title,
    }));
    return tokensInfoOutput;
  }

  async deleteTokenByDevicesId(dto: IDeleteRefreshTokenDto): Promise<void> {
    await this.authRepository.deleteTokenByDevicesId(dto);
  }
}
