import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailAdapter {
  constructor(private mailerService: MailerService) {}
  async sentEmail(
    email: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: 'kupchikrabota@gmail.com',
      subject,
      text,
      html,
    });
  }
}
