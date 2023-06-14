import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './role.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create({
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
      fullName: dto.fullName,
      role: Role.USER,
    });
  }

  async getAllUsers(row: number) {
    return await this.userRepository.findAll({
      order: ['id'],
      limit: 50,
      offset: 50 * row,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email },
      include: { all: true },
    });
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }
}
