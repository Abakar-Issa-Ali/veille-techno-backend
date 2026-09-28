import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';

export type AuthUser = Omit<User, 'password'>;

// Restricts a route to the given roles
export const Roles = Reflector.createDecorator<Role[]>();

// Injects the authenticated user (set by AuthGuard)
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => context.switchToHttp().getRequest().user,
);