import { BadRequestException } from '@nestjs/common';

export class AppException extends BadRequestException {
  messages: any;
  name: string;
  message = null;

  constructor(messages: any) {
    super();
    this.messages = messages;
    this.message = null;
    this.name = 'AppException';
  }
}
