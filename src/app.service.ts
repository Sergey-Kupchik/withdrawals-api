import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWithdrawals(): string {
    return '10.55 5/16/23 withdrawals-api running... ';
  }
}
