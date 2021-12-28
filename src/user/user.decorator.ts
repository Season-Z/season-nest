import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!!req.user) {
      return !!data ? req.user[data] : req.user[data];
    }

    const token = req.headers.authorization;
    if (token) {
      const decoded: any = jwt.verify(token, SECRET);
      return !!data ? decoded[data] : decoded.user[data];
    }
  },
);
