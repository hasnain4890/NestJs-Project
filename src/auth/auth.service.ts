import { UserService } from '../users/user.service';
import { SignInDto } from './dto/signin.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { jwtConstants } from './constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
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

    return this.generateTokens(user.id, user.userName);
  }

  private async generateTokens(userId: number, userName: string) {
    const tokenPayload = { sub: userId, userName: userName };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '60s',
    });

    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '1d',
    });

    const existingRefreshToken = await this.refreshTokenRepository.findOne({
      where: { userId: userId },
    });

    if (existingRefreshToken) {
      existingRefreshToken.refreshToken = refreshToken;
      await this.refreshTokenRepository.save(existingRefreshToken);

      return {
        accessToken,
        refreshTokenUuid: existingRefreshToken.uuid,
      };
    } else {
      const refreshTokenEntity = this.refreshTokenRepository.create({
        uuid: uuidv4(),
        refreshToken,
        userId: userId,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
      return {
        accessToken,
        refreshTokenUuid: refreshTokenEntity.uuid,
      };
    }
  }

  async refreshToken(uuid: string) {
    const checkRefreshToken = await this.refreshTokenRepository.findOne({
      where: { uuid: uuid },
    });
    if (!checkRefreshToken) {
      throw new UnauthorizedException('invalid token');
    }
    const varifyToken = this.jwtService.verify(checkRefreshToken.refreshToken, {
      secret: jwtConstants.secret,
    });

    if (!varifyToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { id, userName } = varifyToken;
    const newAccessToken = this.generateTokens(id, userName);
    return newAccessToken;
  }
}
