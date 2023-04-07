import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWithdrawals(): string {
    return '9.31 4/6/23 withdrawals-api running... ';
  }
}
