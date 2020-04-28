import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ConfigService } from '../config/config.service';

import { PhoneVerification } from './interfaces/phone-verification.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { VerifyPhoneDto } from './dto/verify-phone.dto';

const SMS_API_URL = 'http://smspilot.ru/api.php';

@Injectable()
export class AuthService {

  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private httpService: HttpService,
    @InjectModel('PhoneVerification') private readonly phoneVerification: Model<PhoneVerification>
  ) { }

  public async validateUserByPassword(
    credentials: CreateUserDto
  ): Promise<any> {
    const user: any = await this.userService.findByPhone(credentials.phone);
    if (!user) {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (!user.auth.phone.valid) {
      throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);
    }
  }

  async verifyPhone(phoneDto: VerifyPhoneDto, token: string) {
    const phoneVerification = await this.phoneVerification.findOne({ phone: phoneDto.ticket });

    if(phoneVerification && phoneVerification.token && token === phoneVerification.token) {

      // Token expired after 5 min
      if ((new Date().getTime() - phoneVerification.timestamp.getTime()) / 60000 > 5) {
        throw new HttpException('REGISTRATION.PHONE_TOKEN_EXPIRED', HttpStatus.FORBIDDEN);
      }

      const user = await this.userService.findByPhone(phoneDto.ticket);

      if(user) {
        user.verified = true;
        const savedUser = await user.save();
        await phoneVerification.remove();
        return true;
      } else {
        throw new HttpException('REGISTRATION.USER_NOT_FOUND', HttpStatus.FORBIDDEN);
      }

    } else {
      throw new HttpException('REGISTRATION.PHONE_TOKEN_NOT_VALID', HttpStatus.FORBIDDEN);
    }
  }

  async sendSmsToken(phone: string) {

    var model = await this.phoneVerification.findOne({ phone: phone });
 
    if (model && model.token) {
    
      const params = {
        to: phone,
        from: 'INFORM',
        send: `Confirmation code ${ model.token }`,
        apikey: this.configService.get('SMSPILOT_TOKEN'),
        format: 'json'
      }

      const result =  await this.httpService.get(SMS_API_URL, { params })
        .pipe(
          map(res => res.data)
        )
        .toPromise()
        .then(data => !!data.send)
        .catch(error => error);

      return result;  
    
    } else { 
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }   
  }

  async createSmsToken(phone: string): Promise<boolean> {
    const phoneVerification = await this.phoneVerification.findOne({ phone: phone });

    if (phoneVerification && (new Date().getTime() - phoneVerification.timestamp.getTime()) / 60000 < 5) {
      throw new HttpException('REGISTRATION.TOKEN_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
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

