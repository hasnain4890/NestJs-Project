import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request: any = context.switchToHttp().getRequest();
    const userRole = request.headers['role'];

    //     const { user } = context.switchToHttp().getRequest();
    //     console.log('User:', user);
    //     console.log('Required Roles:', requiredRoles);
    return requiredRoles.some((role) => [userRole]?.includes(role));
  }
}
