import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from '../roles/user-roles.model';
import { Includeable } from 'sequelize';
import { Role } from '../roles/role.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create({
      email: dto.email,
      password: dto.password,
    });
  }

  async getAllUsers(row: number) {
    return await this.userRepository.findAll({
      include: [Role],
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

  async getUserById(
    id: number,
    include: Includeable | Includeable[] = [],
    exclude: string[] = [],
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      include: include,
      attributes: {
        exclude: exclude,
      },
    });
  }
}
