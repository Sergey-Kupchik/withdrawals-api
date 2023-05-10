import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { UserRegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async registrationNewUser(dto: UserRegisterDto): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) return false;
    return false;
  }
}
