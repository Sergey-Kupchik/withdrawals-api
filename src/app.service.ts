import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWithdrawals(): string {
    return '11.13 6/5/23 withdrawals-api running... ';
  }
}
