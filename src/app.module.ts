import { Module } from '@nestjs/common';
import { NeconfigModule } from 'neconfig';
import { MongooseModule } from '@nestjs/mongoose';

import * as path from 'path';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    NeconfigModule.register({
      readers: [
        { name: 'env', file: path.resolve(process.cwd(), '.env') }
      ]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URI'),
          useUnifiedTopology: true,
          useCreateIndex: true,
          useNewUrlParser: true,
        }
      },
      inject: [ConfigService], 
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
