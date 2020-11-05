import { IsString } from 'class-validator';

export class RegisterLocalDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
