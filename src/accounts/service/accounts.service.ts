import { Injectable } from '@nestjs/common';
import { Account } from '../account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = new Account();
    account.email = createAccountDto.email;
    account.password = createAccountDto.password;

    const ret = this.accountsRepository.save(account);
    return ret;
  }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findOne(id: string): Promise<Account> {
    return this.accountsRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<Account> {
    return this.accountsRepository.findOne({ where: { email: email } });
  }

  async remove(id: string): Promise<void> {
    await this.accountsRepository.delete(id);
  }
}
