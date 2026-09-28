import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException();

    try {
      const { sub } = await this.jwt.verifyAsync<{ sub: number }>(token);
      // Load the user from DB so role changes and deletions apply immediately
      request.user = await this.prisma.user.findUniqueOrThrow({ where: { id: sub } });
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}