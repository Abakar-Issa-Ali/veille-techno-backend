import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, Roles, type AuthUser } from '../auth/decorators';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateProfileDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.update(user.id, dto);
  }

  @Get()
  @Roles([Role.ADMIN])
  findAll() {
    return this.users.findAll();
  }

  @Get(':id')
  @Roles([Role.ADMIN])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}