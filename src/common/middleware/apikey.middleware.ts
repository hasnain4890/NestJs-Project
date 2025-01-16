import {
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class ApiKeyMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    if (req.headers['x-api-key'] !== 'my-api-key') {
      throw new UnauthorizedException('Api Key Not found');
    }
    req.user = {
      role: 'admin',
      email: 'abc@gamil.com',
    };
    next();
  }
}
