import { NotFoundException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';

describe('UserController', () => {
  let usersController: UserController;
  let usersService: UserService;

  beforeEach(() => {
    usersService = new UserService();
    usersController = new UserController(usersService);
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const result = { message: 'UserList ', users: [] };
      jest.spyOn(usersService, 'getUserLIst').mockImplementation(() => result);
      expect(usersController.UserListV2('')).toBe(result);
    });
  });

  describe('findUser', () => {
    it('should throw NotFoundException if user is not found', () => {
      const uuid = 'non-existent-uuid';
      jest.spyOn(usersService, 'findUser').mockImplementation(() => {
        throw new NotFoundException('User Not Found');
      });

      try {
        usersController.FindUser(uuid);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User Not Found');
      }

      expect(usersService.findUser).toHaveBeenCalledWith(uuid);
    });
  });

  describe('CreateUser', () => {
    it('should create a user successfully', () => {
      const userDto: UserCreateDto = {
        userName: 'John Doe',
        email: 'johndoe@example.com',
      };

      const result = {
        message: 'User created successfully',
        user: { uuid: 'some-uuid', ...userDto },
      };

      jest.spyOn(usersService, 'createUser').mockReturnValue(result);

      const response = usersController.CreateUser(userDto);
      expect(response).toBe(result);
      expect(usersService.createUser).toHaveBeenCalledWith(userDto);
    });
  });
});
