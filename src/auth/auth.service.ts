import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.users.create(dto);
    return this.signToken(user.id);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user.id);
  }

  private async signToken(userId: number) {
    return { accessToken: await this.jwt.signAsync({ sub: userId }) };
  }
}