import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { EmailManager } from './email.manager';
import { CreateUserDto } from '../users/dto/create-user.dto';
import compareDesc from 'date-fns/compareDesc';
import { add } from 'date-fns';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly emailManager: EmailManager,
    private jwtService: JwtService,
  ) {}

  async registrationNewUser(dto: CreateUserDto): Promise<boolean> {
    const emailInstance = await this.usersRepository.findByEmail(dto.email);
    if (emailInstance) return false;
    const loginInstance = await this.usersRepository.findByLogin(dto.login);
    if (loginInstance) return false;
    await this.usersService.create(dto);
    const user = await this.usersRepository.findByLogin(dto.login);
    if (!user) return false;
    try {
      await this.emailManager.sentConfirmationEmail(
        dto.email,
        user.emailConfirmation.confirmationCode,
      );
      return true;
    } catch {
      await this.usersQueryRepository.deleteById(user.accountData.id);
      return false;
    }
  }

  async confirmUser(code: string): Promise<boolean> {
    const user = await this.usersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (compareDesc(new Date(), user.emailConfirmation.expirationDate) !== 1)
      return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    return this.usersService.confirmUser(user.accountData.id);
  }

  async resentConfirmationEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    try {
      const confirmationCode = await this.usersService.updateConfirmationCode(
        user.accountData.id,
      );
      if (!confirmationCode) return false;
      await this.emailManager.sentConfirmationEmail(email, confirmationCode);
      return true;
    } catch {
      await this.usersQueryRepository.deleteById(user.accountData.id);
      return false;
    }
  }

  async sentPasswordRecovery(email: string): Promise<boolean> {
    const resetPasswordExpires = add(new Date(), { hours: 5 });
    const recoverCode = await this.jwtService.signAsync({ email });
    console.log(`recoverCode from sentPasswordRecovery: ${recoverCode}`);
    console.log(
      `resetPasswordExpires from sentPasswordRecovery: ${resetPasswordExpires}`,
    );
    try {
      await this.emailManager.sentPasswordRecoveryEmail(email, recoverCode);
      await this.usersService.resetPassword(email, recoverCode);
      return true;
    } catch {
      return false;
    }
  }
}
