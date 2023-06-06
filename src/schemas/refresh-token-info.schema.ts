import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class RefreshTokensInfo {
  @Prop({ unique: true })
  userId: string;

  @Prop({
    refreshTokensInfo: [
      {
        deviceId: String,
        lastActiveDate: String,
        ip: String,
        title: String,
        expiresIn: String,
      },
    ],
    default: [],
  })
  refreshTokensInfo: [
    {
      deviceId: string;
      lastActiveDate: string;
      ip: string;
      title: string;
      expiresIn: string;
    },
  ];
  static async createCustomItem(
    userId: string,
    Model: RefreshTokensInfoModelType,
  ): Promise<RefreshTokensInfoDocument> {
    const refreshTokensInfoDto = {
      userId: userId,
      refreshTokensInfo: [],
    };
    return new Model(refreshTokensInfoDto).save();
  }
}

type RefreshTokensInfoType = {
  createCustomItem: (
    userId: string,
    Model: RefreshTokensInfoModelType,
  ) => Promise<RefreshTokensInfoDocument>;
};

export const RefreshTokensInfoSchema =
  SchemaFactory.createForClass(RefreshTokensInfo);

export type RefreshTokensInfoDocument = HydratedDocument<RefreshTokensInfo>;

export type RefreshTokensInfoModelType = Model<RefreshTokensInfoDocument> &
  RefreshTokensInfoType;

RefreshTokensInfoSchema.statics = {
  createCustomItem: RefreshTokensInfo.createCustomItem,
} as RefreshTokensInfoType;
