import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  
  private readonly config: { [name: string]: string }
  
  constructor() {
    if (
      process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      this.config = {
        SMSPILOT_TOKEN: process.env.SMSPILOT_TOKEN
      }
    } else {
      this.config = dotenv.parse(fs.readFileSync('.env'));
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
