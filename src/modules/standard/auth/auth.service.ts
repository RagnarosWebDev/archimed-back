import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../models/user/user.model';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../../../models/user/role.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginDto) {
    return this.generateToken(await this.validateUser(userDto));
  }

  async registration(userDto: RegisterUserDto) {
    const candidate: User = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userRepository.create({
      ...userDto,
      password: hashPassword,
      role: Role.USER,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = this.jwtService.sign(payload);
    return {
      token: token,
    };
  }

  private async validateUser(userDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (!user) {
      throw new BadRequestException({
        message: 'Некорректный email или пароль',
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new BadRequestException({
      message: 'Некорректный email или пароль',
    });
  }
}
