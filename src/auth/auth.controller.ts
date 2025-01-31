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
import { AuthGuard } from 'src/common/guards/auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  //get profile endpoint
  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    console.log(token, '====>');
  }
}
