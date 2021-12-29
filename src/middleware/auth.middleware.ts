import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders) {
      const decoded: any = jwt.verify(authHeaders, SECRET);
      const user = await this.userService.findById(decoded.id);

      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
      }

      (req as any).user = user;
      next();
    } else {
      throw new HttpException('没有权限', HttpStatus.UNAUTHORIZED);
    }
  }
}
