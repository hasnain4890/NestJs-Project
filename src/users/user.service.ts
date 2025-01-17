import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UserService {
  users: UserCreateDto[] = [];
  getUserLIst(userName: string) {
    if (userName) {
      return this.users.filter((user) => user.userName.includes(userName));
    }
    return {
      message: 'Userlist',
      users: this.users,
    };
  }

  //Create User Service
  createUser(userDto: UserCreateDto) {
    const newUser = {
      uuid: uuidv4(),
      ...userDto,
    };
    this.users.push(newUser);
    return { message: 'User created successfully', user: newUser };
  }

  // Find User Service
  findUser(uuid: string) {
    const user = this.users.find((user) => user.uuid === uuid);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  // Update User Service
  updateUser(uuid: string, userUpdatedDto: UserUpdateDto) {
    const userIndex = this.users.findIndex((user) => user.uuid === uuid);

    if (userIndex === -1) {
      throw new NotFoundException('User Not Found');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userUpdatedDto };
    return {
      message: 'User updated successfully',
      user: this.users[userIndex],
    };
  }

  // Delete User Service
  deleteUser(uuid: string) {
    const user = this.users.find((user) => user.uuid === uuid);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    this.users = this.users.filter((user) => user.uuid !== uuid);
    return {
      message: 'User Deleted successfully',
      user: user,
    };
  }
}
