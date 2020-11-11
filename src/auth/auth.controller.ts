import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { RegisterLocalDto } from './dto/register-local.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('facebook-token'))
  @Get('facebook')
  async getTokenAfterFacebookSignIn(@Request() req) {
    return this.authService.loginOAuth(req.user.email);
  }

  @Post('/register')
  async signUp(@Body() registerLocalDto: RegisterLocalDto) {
    return this.authService.register(registerLocalDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }
}
