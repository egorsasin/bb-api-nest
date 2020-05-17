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

export class ResponseError implements HttpResponse{
  
  constructor (message:string, data?: any) {
    this.success = false;
    this.message = message;
    this.payload = data;
    console.warn(new Date().toString() + ' - [Response]: ' + message + (data ? ' - ' + JSON.stringify(data): ''));
  };

  message: string;
  payload: any[];
  error: any;
  success: boolean;
}