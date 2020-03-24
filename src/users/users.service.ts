import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user';

@Injectable()
export class UsersService {

  private users: User[] = [];

  async findByPhone(phone: string): Promise<User> {
    return new Promise(resolve => resolve(
      this.users.find(user => user.phone === phone)
    ));
  }

  async createUser(newUser: UserDto): Promise<User> {

    if(this.isPhoneValid(newUser.phone)) { 
      const existingUser = await this.findByPhone(newUser.phone);
      if(!existingUser) {
        return new Promise(resolve => resolve());
      } else {
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', HttpStatus.FORBIDDEN);
    }
  }

  private isPhoneValid(phone: string): boolean {
      return /^79\d{9}$/.test(phone);
  }

}
