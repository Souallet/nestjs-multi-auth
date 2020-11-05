import { Controller, Get, Param } from '@nestjs/common';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { AccountsService } from './service/accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(): string {
    return 'This action will return all accounts';
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe())
    id: number,
  ): string {
    return `This action will return account : ${id}`;
  }
}
