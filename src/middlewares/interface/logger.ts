import { LogStatusEnum, LogActionEnum, MethodEnum } from '@prisma/client';

export class AuditLog {
  id: number;
  ip: string;
  email: string;
  url: string;
  status: LogStatusEnum;
  action: LogActionEnum;
  method: MethodEnum;
  information: string;
  createdAt: Date;
  functionCalled?: string;

  constructor(
    functionCalled: string,
    ip: string,
    url: string,
    method: MethodEnum,
    email: string,
    status: LogStatusEnum,
    action: LogActionEnum,
    information: string,
  ) {
    this.functionCalled = functionCalled;
    this.method = method;
    this.ip = ip;
    this.email = email;
    this.url = url;
    this.status = status;
    this.action = action;
    this.information = information;
  }
}

export class AuditLogRequestInformation {
  ip: string;
  url: string;
  method: string;

  constructor(ip: string, url: string, method: string) {
    this.ip = ip;
    this.url = url;
    this.method = method;
  }
}
