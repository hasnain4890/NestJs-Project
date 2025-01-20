import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepositoryMock: Partial<Repository<User>>;

  beforeEach(async () => {
    userRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, userName: 'John Doe', email: 'john@example.com' },
      ];
      jest.spyOn(userRepositoryMock, 'find').mockResolvedValue(mockUsers);

      const result = await userController.UserListV2();
      expect(result).toEqual({ message: 'User list', users: mockUsers });
    });
  });

  describe('createUser', () => {
    it('should create a new user and return the created user object', async () => {
      const mockUserDto = { userName: 'New User', email: 'new@example.com' };
      const mockUser = {
        id: 1,
        ...mockUserDto,
      };
      jest.spyOn(userRepositoryMock, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue(mockUser);

      const result = await userController.CreateUser(mockUserDto);
      expect(result).toEqual({
        message: 'User created successfully',
        user: mockUser,
      });
    });
  });

  describe('updateUser', () => {
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);

      const userUpdateDto = {
        userName: 'Updated User',
        email: 'updated@example.com',
      };
      await expect(userController.UpdateUser(1, userUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update an existing user', async () => {
      const existingUser = {
        id: 1,
        userName: 'Old Name',
        email: 'old@example.com',
      };
      const updatedUser = { ...existingUser, userName: 'Updated Name' };

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue(updatedUser);

      const result = await userController.UpdateUser(1, {
        userName: 'Updated Name',
      });
      expect(result).toEqual({
        message: 'User updated successfully',
        user: updatedUser,
      });
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);

      await expect(userController.DeleteUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete a user and return confirmation message', async () => {
      const existingUser = {
        id: 1,
        userName: 'Delete Me',
        email: 'delete@example.com',
      };
      const deleteResult = { affected: 1, raw: {} }; // Mocked DeleteResult

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(userRepositoryMock, 'delete').mockResolvedValue(deleteResult);

      const result = await userController.DeleteUser(1);
      expect(result).toEqual({
        message: 'User deleted successfully',
        user: deleteResult,
      });
    });
  });
});
