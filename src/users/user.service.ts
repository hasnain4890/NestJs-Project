import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserList(userName: string) {
    if (userName) {
      const users = await this.userRepository.find({
        where: { userName: Like(`%${userName}%`) },
      });
      return {
        message: `Users matching: ${userName}`,
        users,
      };
    }

    const users = await this.userRepository.find();
    return {
      message: 'User list',
      users,
    };
  }

  //Create User Service
  async createUser(userDto: UserCreateDto) {
    const newUser = this.userRepository.create({
      ...userDto,
    });
    const user = await this.userRepository.save(newUser);
    return {
      message: 'User created successfully',
      user: user,
    };
  }

  // Find User Service
  findUser(id: number) {
    const user = this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  // Update User Service
  async updateUser(id: number, userUpdatedDto: UserUpdateDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = Object.assign(user, userUpdatedDto);
    await this.userRepository.save(updatedUser);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // Delete User Service
  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const deleteUser = await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully',
      user: deleteUser,
    };
  }
}
