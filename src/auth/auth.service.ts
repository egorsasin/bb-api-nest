import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ConfigService } from '../config/config.service';
import { PhoneVerification } from './interfaces/phone-verification.interface';

const SMS_API_URL = 'http://smspilot.ru/api.php';

@Injectable()
export class AuthService {

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectModel('PhoneVerification') private readonly phoneVerification: Model<PhoneVerification>
  ) { }

  async sendSmsToken(phone: string) {

    var model = await this.phoneVerification.findOne({ phone: phone });

    if (model && model.token) {
    
      const apiKey = this.configService.get('SMSPILOT_TOKEN');
      const from = 'INFORM';
      const text = `Код подтверждения`;
      
      const url = `${ SMS_API_URL }?send=${ text }&to=${ phone }&from=${ from }&apikey=${ apiKey }&format=json`;

      return this.httpService.get(url)
        .pipe(map(res => res.data)).toPromise();
    
    } else { 
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }   
  }

  async createSmsToken(phone: string): Promise<boolean> {
    const phoneVerification = await this.phoneVerification.findOne({ phone: phone });

    if (phoneVerification && (new Date().getTime() - phoneVerification.timestamp.getTime()) / 60000 < 5) {
      throw new HttpException('LOGIN.TOKEN_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.phoneVerification.findOneAndUpdate(
      { phone: phone },
      { 
        phone: phone,
        phoneToken: this.generateToken(),
        timestamp: new Date()
      },
      { upsert: true }
    );

    return true;
  }


  private generateToken(length: number = 4): string {
      
    const possible = '0123456789';
    let token = '';
    
    for (let i = 0; i < length; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return token;
  }
}

