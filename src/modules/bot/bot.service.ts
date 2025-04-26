import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class BotService {
  private readonly loggin: Logger = new Logger(BotService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.BOT_SERVICE,
    });
  }

  async sendMail(params: { telegram_user_id: string; message: string }): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/telegram', {
        params: {
          user_id: params.telegram_user_id,
          message: params.message,
        },
      });
      return response.data;
    } catch (error) {
      // Handle errors as needed
      this.loggin.error('Error sending mail:', error);
      // throw new Error(`Error fetching data: ${error.message}`);
    }
  }
}
