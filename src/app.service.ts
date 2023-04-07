import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWithdrawals(): string {
    return '1.51 4/7/23 withdrawals-api running... ';
  }
}
