// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '../decorators/roles.enum';
// import { ROLES_KEY } from '../decorators/roles.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       return true;
//     }

//     const request: any = context.switchToHttp().getRequest();
//     const userRole = request.headers['role'];

//     //     const { user } = context.switchToHttp().getRequest();
//     //     console.log('User:', user);
//     //     console.log('Required Roles:', requiredRoles);
//     return requiredRoles.some((role) => [userRole]?.includes(role));
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/auth/constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
// Welcome2PDI!
