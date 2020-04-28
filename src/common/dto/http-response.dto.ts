import { HttpResponse } from '../interfaces/http-response.intrface'

export class HttpSuccess implements HttpResponse{
  
  success: boolean;
  message: string;
  payload: any
  
  constructor(message: string, payload?: any) {
    this.message = message;
    this.success = true;
    this.payload = payload;
  }
}