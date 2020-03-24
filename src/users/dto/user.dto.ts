export class UserDto {
  
  readonly phone: string;

  constructor(data: any) {
    this.phone = data.phone;
  }
}