import { Controller, Body, Post, HttpStatus,  Res, HttpCode } from '@nestjs/common';

import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { HttpSuccess, ResponseError } from '../common/dto/http-response.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { UsersService } from '../users/users.service';

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
      return res.status(HttpStatus.OK).json({ msg: 'REGISTRATION.USER_REGISTERED_SUCCESSFULLY' });
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(
    @Body() findUserDto: CreateUserDto
  ) {
    const user = this.userService.findByPhone(findUserDto.phone);
    if (user) {
      return new ResponseError('REGISTRATION.USER_ALREADY_EXISTS');
    }

    //await this.authService.createSmsToken(newUser.phone);
    try {
      const requestId = await this.authService.sendSmsToken(findUserDto.phone);
    } catch(error) {
    }
    //if (messageSent) {
      return { msg: 'REGISTRATION.USER_REGISTERED_SUCCESSFULLY' };
    //} else {
    //  throw new HttpException("REGISTRATION.ERROR.SMS_NOT_SENT", HttpStatus.INTERNAL_SERVER_ERROR);
    //}

  }

}
