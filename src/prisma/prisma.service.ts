import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Never return password hashes unless a query explicitly asks for them
    super({ omit: { user: { password: true } } });
  }

  async onModuleInit() {
    await this.$connect();
  }
}