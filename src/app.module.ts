import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

import mainConfiguration from './config/main.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [mainConfiguration], expandVariables: true }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
