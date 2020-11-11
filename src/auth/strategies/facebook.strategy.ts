import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { use } from 'passport';

@Injectable()
export class FacebookStrategy {
  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  init() {
    use(
      new FacebookTokenStrategy(
        {
          clientID: this.configService.get('facebook.app.id'),
          clientSecret: this.configService.get('facebook.app.secret'),
          fbGraphVersion: 'v9.0',
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any,
        ) => {
          const user = {
            ...profile._json,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          return done(null, user);
        },
      ),
    );
  }
}
