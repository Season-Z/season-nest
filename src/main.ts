import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import requestIp from 'request-ip';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const corsOptions = {
    origin(origin, callback) {
      callback(null, true);
    },
    credentials: true,
  };
  app.enableCors(corsOptions); // 前端设置 withCredentials: true, 后端这样设置cookie跨域读取
  // 配置视图文件的目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局使用拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  //配置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });
  // 访问频率限制
  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000, // 60分钟
      max: 5000, // 限制15分钟内最多只能访问500次
    }),
  );
  // web安全方面的防范，优化
  app.use(helmet());
  // 获取ip地址，因为反向代理后无法获取客户端的ip地址。也可以请求头设置 x-forwarded-for
  app.use(requestIp.mw());

  const options = new DocumentBuilder()
    .setTitle('season')
    .setDescription('API description')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/doc', app, document);

  await app.listen(3000, () => {
    Logger.log(`服务已经启动,请访问:http://wwww.localhost:${3000}`);
  });
}
bootstrap();
