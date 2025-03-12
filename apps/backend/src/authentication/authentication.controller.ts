/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { AuthenticationShapeDto, AuthenticationShapeOtpDto, PasswordRecoveryCheckerDto, SignInResponseShapeDto } from './dto/auth.dto';
import { LoginResponseShapeDto } from './dto/login.dto';

@Controller('authentication')
@UsePipes(ZodValidationPipe)
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }

  @Post('login')
  async signIn(@Body() signInDto: AuthenticationShapeDto): Promise<SignInResponseShapeDto> {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Post('otp-login')
  async verifyTwoFactorCode(@Body() verifyDto: AuthenticationShapeOtpDto): Promise<LoginResponseShapeDto> {
    return this.authService.otpLogin(verifyDto.email, verifyDto.otp);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Post('register')
  async register(@Body() registerDto: AuthenticationShapeDto) {
    return this.authService.createUser(registerDto.email, registerDto.password);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Post('password-reset')
  async passwordReset(@Body() resetDto: PasswordRecoveryCheckerDto) {
    return this.authService.passwordRecovery(resetDto.email, resetDto.password, resetDto.confirmPassword);
  }
}
