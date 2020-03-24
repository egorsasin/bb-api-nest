import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async findByPhone(phone: string): Promise<User> { 
    return await this.userModel.findOne({ phone: phone });
  }

  async createUser(newUserDTO: UserDto): Promise<User> {

    if(this.isPhoneValid(newUserDTO.phone)) { 

      const existingUser = await this.findByPhone(newUserDTO.phone);

      if(!existingUser) {
        const newUser = new this.userModel(newUserDTO);
        return await newUser.save();
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
