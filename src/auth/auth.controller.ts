import { Controller, Body, Post, HttpException, HttpStatus, Get, Res, Param } from '@nestjs/common';

import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HttpSuccess } from '../common/dto/http-response.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Post('login')
  public async login(
    @Body() loginUserDto: CreateUserDto
  ) {
    const result = this.authService.validateUserByPassword(loginUserDto);
  }

  @Post('verify')
  public async verifyPhone(
    @Body() verifyPhoneDto: VerifyPhoneDto,
    @Res() res
  ): Promise<any> {
    try {
      var phoneVerified = await this.authService.verifyPhone(verifyPhoneDto, '111');
      return new HttpSuccess("LOGIN.PHONE_VERIFIED", phoneVerified);
    } catch(error) {
      return res.status(HttpStatus.OK).json{}
    }
  }

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto, 
    @Res() res
  ) {

    const newUser = new UserDto(await this.userService.createUser(createUserDto));
    await this.authService.createSmsToken(newUser.phone);
    const messageSent = await this.authService.sendSmsToken(newUser.phone);
    
    if (messageSent) {
      return res.status(HttpStatus.OK).json({ msg: 'REGISTRATION.USER_REGISTERED_SUCCESSFULLY' });
    } else {
      throw new HttpException("REGISTRATION.ERROR.SMS_NOT_SENT", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
