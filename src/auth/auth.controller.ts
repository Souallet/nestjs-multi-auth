import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { LoginLocalDto } from './dto/login-local.dto';
import { RegisterLocalDto } from './dto/register-local.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
