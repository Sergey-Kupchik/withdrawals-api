import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWithdrawals(): string {
    return '10.15 4/5/23 withdrawals-api running... ';
  }
}
