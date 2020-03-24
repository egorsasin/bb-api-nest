import { Controller, Body, Post, HttpException, HttpStatus, Get } from '@nestjs/common';
import { userDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return 'Auth service';
  }

  @Post('register')
  async register(
    @Body() body: userDto
  ) {
    // try {
    //   const newUser = new UserDto(await this.userService.createNewUser(createUserDto));
    // const result = await this.authService.register('79817995786');
    // console.log(result);
  }

}
