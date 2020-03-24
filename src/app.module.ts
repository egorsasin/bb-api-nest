import { Module } from '@nestjs/common';
import { NeconfigModule } from 'neconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import * as path from 'path';



@Module({
  imports: [ 
    AuthModule,
    NeconfigModule.register({
      readers: [
        { name: 'env', file: path.resolve(process.cwd(), '.env') }
      ]
    }),
    ConfigModule,
    UsersModule 
  ],
  controllers: [ AppController ],
  providers: [ AppService, ConfigService ],
})
export class AppModule {}
