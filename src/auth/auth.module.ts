import { Module, HttpModule } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ConfigService } from '../config/config.service';

@Module({
  imports: [ HttpModule ],
  controllers: [ AuthController ],
  providers: [ AuthService, ConfigService ],
})
export class AuthModule {}
