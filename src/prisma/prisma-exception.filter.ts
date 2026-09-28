import { ArgumentsHost, Catch, ConflictException, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

// Maps common Prisma errors to HTTP errors instead of a generic 500
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (error.code === 'P2002') return super.catch(new ConflictException('Resource already exists'), host);
    if (error.code === 'P2025') return super.catch(new NotFoundException('Resource not found'), host);
    super.catch(error, host);
  }
}