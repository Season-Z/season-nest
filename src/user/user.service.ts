import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { BaseUserDto, UserTokenDto } from './user.dto';
import { UserEntity } from './user.entity';
import { SECRET } from '../utils/config';
// import { CRYPTO_SECRET } from '../utils/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async create(dto: BaseUserDto): Promise<UserEntity> {
    const { username, password } = dto;

    const search = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username });

    const user = await search.getOne();

    if (user) {
      throw new HttpException(
        {
          message: '输入值有误',
          error: '已经存在该用户名',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPassword = await argon2.hash(password);
    Reflect.set(dto, 'password', newPassword);

    return await this.userRepository.save(dto);
  }

  async findOne(dto: BaseUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ username: dto.username });

    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, dto.password)) {
      return user;
    } else {
      return null;
    }
  }

  async update(id: number, dto: BaseUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    Reflect.deleteProperty(user, 'password');

    const newPassword = await argon2.hash(dto.password);
    const updated = Object.assign(user, { ...dto, password: newPassword });

    return await this.userRepository.save(updated);
  }

  async findById(id: number): Promise<UserTokenDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        {
          error: '不存在该用户名',
        },
        401,
      );
    }

    return this.buildUserRO(user);
  }

  async generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);

    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        exp: exp.getTime() / 1000,
      },
      SECRET,
    );
  }

  private buildUserRO(user: UserEntity): UserTokenDto {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      token: this.generateJWT(user),
    };
  }
}
