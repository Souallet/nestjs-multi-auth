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

  async validateLocalAccount(email: string, password: string): Promise<any> {
    if (password === null || password === '') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password cannot be empty.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

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
    return { access_token: await this.generateToken(account) };
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

    const registeredAccount = await this.accountsService.create(
      createAccountDto,
    );
    return { access_token: await this.generateToken(registeredAccount) };
  }

  async loginOAuth(email: string) {
    let account = await this.accountsService.findByEmail(email);

    if (!account) {
      account = await this.accountsService.create({
        email: email,
        password: null,
      });
    }

    return { access_token: await this.generateToken(account) };
  }

  async generateToken(account: Account) {
    const payload = {
      id: account.id,
    };
    return this.jwtService.sign(payload);
  }
}
