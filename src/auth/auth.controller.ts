import { Controller, Body, Post, HttpException, HttpStatus, Get } from '@nestjs/common';

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

  @Get()
  getHello(): string {
    return 'Auth service';
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto
  ) {
    try {
      const newUser = new UserDto(await this.userService.createUser(createUserDto));
      await this.authService.createSmsToken(newUser.phone);
      const smsStatus = await this.authService.sendSmsToken(createUserDto.phone);
      if (smsStatus.error) {}
      
    } catch {
      console.log('Error');
    }
  }

}
