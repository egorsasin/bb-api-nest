import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../config/config.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UserSchema } from '../users/schemas/user.schema';
import { PhoneVerificationSchema } from './schemas/phone-verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'User',
      schema: UserSchema
    },
    {
      name: 'PhoneVerification',
      schema: PhoneVerificationSchema
    }]),
    ConfigModule,
    HttpModule,
  ],
  providers: [ 
    AuthService, 
    UsersService 
  ],
  controllers: [ AuthController ]
})
export class AuthModule {}
