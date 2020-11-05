import { IsString } from 'class-validator';

export class LoginLocalDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
