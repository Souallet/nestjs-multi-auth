import { Account } from '../../accounts/account.entity';
import { AccountsService } from '../../accounts/service/accounts.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { RegisterLocalDto } from '../dto/register-local.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private accountsService: AccountsService,
  ) {}

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountsService.findByEmail(email);

    if (!account) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'This user does not exist.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isSamePassword = await bcrypt.compare(password, account.password);

    if (account && isSamePassword) {
      const { password, ...result } = account;
      return result;
    }
    return null;
  }

  async login(account: Account) {
    const payload = { username: account.email, sub: account.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerLocalDto: RegisterLocalDto) {
    const account = await this.accountsService.findByEmail(
      registerLocalDto.email,
    );

    if (account) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User already exist.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(registerLocalDto.password, 10);

    const createAccountDto: CreateAccountDto = {
      email: registerLocalDto.email,
      password: hashedPassword,
    };

    return this.accountsService.create(createAccountDto);
  }
}
