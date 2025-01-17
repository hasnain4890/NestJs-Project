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

  //   // Get Method
  //   @Get()
  //   @Redirect('http://localhost:3000/users/list', 301)
  //   UserList(@Req() req: any, @Ip() ip: string) {
  //     return this.userService.getUserLIst();
  //   }

  @Get()
  @Roles(Role.Admin)
  UserListV2(
    @Query('userName') userName?: string,
    //     @CurrentUser('email') email: string,
    @CurrentUser('email') user?: any,
    //     @Req() request: any,
  ) {
    console.log('user in controller', user);
    return this.userService.getUserLIst(userName);
  }

  // Post Method
  @Post()
  @Roles(Role.Admin)
  //   @Header('Cache-Control', 'hasnian')
  CreateUser(@Body() userDto: UserCreateDto) {
    return this.userService.createUser(userDto);
  }

  // Find User Method
  @Get(':uuid')
  FindUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.findUser(uuid);
  }

  // Update User
  @Patch(':uuid')
  UpdateUser(
    @Param('uuid') uuid: string,
    @Body() userUpdatedDto: UserUpdateDto,
  ) {
    return this.userService.updateUser(uuid, userUpdatedDto);
  }

  // Delete User
  // @Roles(['admin', 'manager' , 'user'])
  @Delete(':uuid')
  DeleteUser(@Param('uuid') uuid: string) {
    return this.userService.deleteUser(uuid);
  }
}
