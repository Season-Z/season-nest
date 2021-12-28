import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { comError } from '@utils/error';
// import { RedisCacheService } from '@modules/redis-utils/redis-cache/redis-cache.service';
// import { ToolsService } from '@tools/tools.service';
/**
 * 用户登录，生成token(uuid~~~)(user_session_uuid存入redis)
 * 除了登录接口，其他接口从redis查询，有没有值，有值就true，没值就false
 */
@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(
  //   private readonly redisCacheService: RedisCacheService,
  //   private readonly toolsService: ToolsService,
  // ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log('context request url>>>>', request.url);
    // console.log('context request headers', request.headers); // username token
    // comError(403, '失败了', 'token过期了');
    // return false; //  true false
    // if (
    //   request.url.includes('/api/login/code') ||
    //   request.url.includes('/api/login') ||
    //   request.url.includes('/api/apimock/return')
    // ) {
    //   return true;
    // } else {
    //   if (!request.headers.token) {
    //     // 没有token 直接拦截
    //     return false;
    //   } else {
    //     // 这里可以从token解出username，后面再处理吧
    //     const headers = request.headers;
    //     const user = await this.toolsService.verifyToken(request.headers.token);
    //     const key = `smart_oa_${user.username}`;
    //     const redisData = await this.redisCacheService.get(key);
    //     if (redisData.token === headers.token) {
    //       return true;
    //     } else {
    //       // comError(401, '失败了', '登录信息失效，请重新登录');
    //       return false;
    //     }
    //   }
    // }
    return true;
  }
}
