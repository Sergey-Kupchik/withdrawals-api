import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersQueryRepository } from '../users/users.query.repository';
import { SignInDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
