import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDecorator } from '@decorator/user.decorator';
import { ValidationPipe } from '@pipe/validation.pipe';
import { BaseUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取所有用户数据' })
  @ApiResponse({ status: 200, description: '返回数据' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Put()
  @UsePipes(new ValidationPipe())
  async update(
    @UserDecorator('id') userId: number,
    @Body() userData: BaseUserDto,
  ) {
    return await this.userService.update(userId, userData);
  }

  @ApiOperation({ summary: '创建新用户' })
  @ApiResponse({ status: 200, description: '返回数据' })
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() userData: BaseUserDto) {
    return this.userService.create(userData);
  }

  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 200, description: '返回数据' })
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() loginData: BaseUserDto) {
    const user = await this.userService.findOne(loginData);

    if (!user) {
      throw new HttpException({ error: '不存在该用户名' }, 401);
    }

    const token = await this.userService.generateJWT(user);
    return {
      username: user.username,
      password: user.password,
      token,
    };
  }
}
