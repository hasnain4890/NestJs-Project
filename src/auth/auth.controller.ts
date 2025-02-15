import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
// import { AuthGuard } from 'src/common/guards/auth.guards';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @Post('login')
  //   signIn(@Body() signInDto: SignInDto) {
  //     return this.authService.signIn(signInDto);
  //   }

  @Post('login')
  @UseGuards(AuthGuard('local')) // Use local strategy for login
  async login(@Body() signInDto: SignInDto) {
    // If successful, the user will be attached to the request object
    return this.authService.generateTokens(1, signInDto.email); // Adjust as needed
  }

  @Post('refresh-token')
  refreshToken(@Body('uuid') uuid: string) {
    return this.authService.refreshToken(uuid);
  }

  //get profile endpoint
  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
  }
}
