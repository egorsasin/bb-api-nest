import { Controller, Body, Post, HttpException, HttpStatus, Get, Res, Param } from '@nestjs/common';

import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Get('verify/:token')
  public async verifyPhone(@Param() params): Promise<any> {
    try {
      //var phoneVerified = await this.authService.verifyPhone(params.token);
      //return new ResponseSuccess("LOGIN.PHONE_VERIFIED", phoneVerified);
    } catch(error) {
      //return new ResponseError("LOGIN.ERROR", error);
    }
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto, @Res() res
  ) {

    const newUser = new UserDto(await this.userService.createUser(createUserDto));
    await this.authService.createSmsToken(createUserDto.phone);
    const messageSent = await this.authService.sendSmsToken(createUserDto.phone);
    
    if (messageSent) {
      return res.status(HttpStatus.OK).json({ msg: 'REGISTRATION.USER_REGISTERED_SUCCESSFULLY' });
    } else {
      throw new HttpException("REGISTRATION.ERROR.SMS_NOT_SENT", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
