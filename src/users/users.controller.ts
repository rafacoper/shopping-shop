import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user/user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  async list(): Promise<User[]> {
    return this.usersService.listAll();
  }

  @Get()
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put()
  async update(@Body() id: string, user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete()
  async delete(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
