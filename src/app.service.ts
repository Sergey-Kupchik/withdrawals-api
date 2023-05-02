import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWithdrawals(): string {
    return '2.05 5/2/23 withdrawals-api running... ';
  }
}
