import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersQueryRepository } from '../users/users.query.repository';
import { SignInDto, UserRegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserIdFromJwt } from './dto/current-userId.decorator';
import { ParseObjectIdPipe } from '../validation/parse-objectId.pipe';
import { RegistrationService } from '../registration/registration.service';

@Controller(`auth`)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registrationService: RegistrationService,
  ) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getAuthInfo(
    @UserIdFromJwt('userId', ParseObjectIdPipe) userId: string,
  ) {
    const user = await this.authService.findUser(userId);
    if (!user) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return user;
  }

  @Post('registration')
  async registration(@Body() userRegisterDto: UserRegisterDto) {
    return this.registrationService.registrationNewUser(userRegisterDto);
  }
}
