import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

const hashPassword = (password: string) => hash(password, 10);

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  // The only query that loads the password hash (needed for login)
  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email }, omit: { password: false } });
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: { ...dto, password: await hashPassword(dto.password) },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const data = dto.password ? { ...dto, password: await hashPassword(dto.password) } : dto;
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }
}