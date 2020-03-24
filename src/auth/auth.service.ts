import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

const SMS_API_URL = 'http://smspilot.ru/api.php';

@Injectable()
export class AuthService {

  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) { }

  register(phone: string) {
    
    const apiKey = this.configService.get('SMSPILOT_TOKEN');
    const from = 'INFORM';
    const text = 'TEST';
    
    const url = `${ SMS_API_URL }?send=${ text }&to=${ phone }&from=${ from }&apikey=${ apiKey }&format=json`;

    return this.httpService.get(url).toPromise();
  }
}
