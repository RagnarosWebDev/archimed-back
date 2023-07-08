import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './role.model';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create({
      ...dto,
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

  async update(id: number, dto: EditUserDto) {
    await this.userRepository.update(
      {
        ...dto,
      },
      {
        where: {
          id: id,
        },
      },
    );
    return this.getUserById(id);
  }
}
