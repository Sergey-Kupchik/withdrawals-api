export interface IUserOutput {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
export interface IUser {
  accountData: {
    id: string;
    login: string;
    email: string;
    hash: string;
    createdAt: string;
    invalidRefreshTokens: string[];
    resetPasswordHash?: string;
    resetPasswordExpires?: Date;
  };
  emailConfirmation: IEmailConfirmation;
}
interface IEmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface IEmailHashInfo {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  resetPasswordHash: string;
  resetPasswordExpires: Date;
}

export interface IAllUsersOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IUserOutput[];
}
