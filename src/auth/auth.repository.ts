import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokensInfo,
  RefreshTokensInfoDocument,
  RefreshTokensInfoModelType,
} from '../schemas/refresh-token-info.schema';
import {
  IRefreshTokenInfo,
  IRefreshTokenPayload,
} from './interfaces/refresh-token-Info.interface';
import {
  ICreateRefreshToken,
  IDeleteRefreshTokenDto,
  IUpdateRefreshToken,
} from './dto/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(RefreshTokensInfo.name)
    private refreshTokensInfoModel: RefreshTokensInfoModelType,
  ) {}

  async save(
    RefreshTokenInfo: RefreshTokensInfoDocument,
  ): Promise<IRefreshTokenInfo> {
    return RefreshTokenInfo.save();
  }
  async findRefreshTokensByUserId(
    userId: string,
  ): Promise<IRefreshTokenPayload[] | null> {
    const user = await this.refreshTokensInfoModel
      .findOne({ userId: userId }, '-_id  -__v')
      .lean();
    if (user) return user.refreshTokensInfo;
    return null;
  }

  async updateRefreshTokenInfo(dto: IUpdateRefreshToken): Promise<boolean> {
    const tokens = await this.findRefreshTokensByUserId(dto.userId);
    if (!tokens) return false;
    const token4Device = tokens.find((t) => t.deviceId === dto.deviceId);
    if (!token4Device) return false;
    const updateToken = await this.refreshTokensInfoModel.findOneAndUpdate(
      {
        userId: dto.userId,
        refreshTokensInfo: { $elemMatch: { deviceId: dto.deviceId } },
      },
      {
        $set: {
          'refreshTokensInfo.$.lastActiveDate': dto.lastActiveDate,
          'refreshTokensInfo.$.ip': dto.clientIp,
        },
      },
      { new: true },
    );
    return true;
  }
  async createRefreshTokenInfo(
    userId: string,
    dto: IRefreshTokenPayload,
  ): Promise<boolean> {
    const addToken = await this.refreshTokensInfoModel.findOneAndUpdate(
      { userId: userId },
      { $push: { refreshTokensInfo: dto } },
      { new: true },
    );
    return true;
  }
  async deleteAll(): Promise<boolean> {
    const resultDoc = await this.refreshTokensInfoModel.deleteMany();
    return resultDoc.acknowledged;
  }

  async deleteTokenByDevicesId(dto: IDeleteRefreshTokenDto): Promise<void> {
    await this.refreshTokensInfoModel.findOneAndUpdate(
      { userId: dto.userId },
      { $pull: { refreshTokensInfo: { deviceId: { $in: [dto.deviceId] } } } },
    );
  }
}
