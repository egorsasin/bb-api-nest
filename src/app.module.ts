import { Module } from '@nestjs/common';
import { NeconfigModule } from 'neconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { NestSessionOptions, SessionModule } from 'nestjs-session';

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
      imports: [ ConfigModule ],
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URI'),
          useUnifiedTopology: true,
          useCreateIndex: true,
          useNewUrlParser: true,
        }
      },
    }),
    SessionModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => {
        return {
          session: {
            secret: configService.get('SESSION_SECRET'),
            resave: true,
            saveUninitialized: false,
          }
        }
      }
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
