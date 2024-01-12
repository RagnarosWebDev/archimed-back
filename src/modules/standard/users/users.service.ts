import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../models/user/user.model';
import { EditUserDto } from './dto/edit-user.dto';
import * as bcrypt from 'bcryptjs';
import { calculateCountPage, rowed } from '../../../utils/shared.extension';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getAllUsers(row: number) {
    return await this.userRepository.findAll(rowed(row));
  }

  async countPages() {
    const count: number = await this.userRepository.count({});

    return { pages: calculateCountPage(count) };
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
        password: dto.password ? await bcrypt.hash(dto.password, 5) : undefined,
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
