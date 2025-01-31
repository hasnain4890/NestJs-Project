import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  findById(sub: any) {
	  throw new Error('Method not implemented.');
  }
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
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return {
      message: 'User list',
      usersWithoutPassword,
    };
  }

  //Create User Service
  async createUser(userDto: UserCreateDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 10);

    const newUser = this.userRepository.create({
      ...userDto,
      password: hashPassword,
    });

    const user = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User created successfully',
      user: userWithoutPassword,
    };
  }

  // Find User Service
  async findUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        products: true, // Include related products if necessary
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    //     const { password, ...userWithoutPassword } = user;

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

  //Find user by email
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
