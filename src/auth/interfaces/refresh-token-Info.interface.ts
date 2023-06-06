export interface IRefreshTokenInfo {
  userId: string;
  refreshTokensInfo: Array<IRefreshTokenPayload>;
}

export interface IRefreshTokenPayload {
  deviceId: string;
  lastActiveDate: string;
  ip: string;
  title: string;
  expiresIn: string;
}

export type IRefreshTokenPayloadOutput = Omit<
  IRefreshTokenPayload,
  'expiresIn'
>;
