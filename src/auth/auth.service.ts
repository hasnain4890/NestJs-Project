import { UserService } from '../users/user.service';
import { SignInDto } from './dto/signin.dto';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email/password');
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email/password');
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const tokenPayload = { sub: user.id, userName: user.userName };
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return {
      accessToken: accessToken,
      expireIn: '1d',
      refreshAccessToken: 'refresh_access_token',
      refreshAccessTokenExpireIn: '1d',
    };
  }

//   async getUserFromToken(token: string) {
//     console.log(token, '------');
//     const decoded = this.jwtService.verify(token);
//     console.log(decoded);
//   }
}
