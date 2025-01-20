import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Ip,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  UserListV2(
    @Query('userName') userName?: string,
    @CurrentUser('email') user?: any,
  ) {
    console.log('user in controller', user);
    return this.userService.getUserList(userName);
  }

  // Post Method
  @Post()
  @Roles(Role.Admin)
  CreateUser(@Body() userDto: UserCreateDto) {
    return this.userService.createUser(userDto);
  }

  // Find User Method
  @Get(':id')
  FindUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUser(id);
  }

  // Update User
  @Patch(':id')
  UpdateUser(@Param('id') id: number, @Body() userUpdatedDto: UserUpdateDto) {
    return this.userService.updateUser(id, userUpdatedDto);
  }

  // Delete User
  // @Roles(['admin', 'manager' , 'user'])
  @Delete(':id')
  DeleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
