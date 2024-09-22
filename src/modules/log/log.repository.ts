import { Injectable } from '@nestjs/common';
import { MethodEnum, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuditLog } from 'src/middlewares/interface/logger';

@Injectable()
class LogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAuditLog(
    data: AuditLog,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuditLog> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.auditLog.create({
      data: {
        ip: data.ip ?? '-',
        email: data.email,
        url: data.url ?? '-',
        status: data.status,
        action: data.action,
        information:
          data.functionCalled != null
            ? `[${data.functionCalled}] ${data.information}`
            : data.information,
        method: data.method ?? MethodEnum.POST,
      },
    });
  }

  async getAuditLogs(
    transaction?: Prisma.TransactionClient,
  ): Promise<AuditLog[]> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    return await prisma.auditLog.findMany();
  }

  async cleanAuditLogs(transaction?: Prisma.TransactionClient): Promise<void> {
    const prisma: Prisma.TransactionClient | PrismaService = transaction
      ? transaction
      : this.prisma;

    await prisma.auditLog.deleteMany();
  }
}

export { LogRepository };
