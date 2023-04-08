import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';
import { AddRoleDto } from './dto/add-role.dto';
import { User } from '../users/user.model';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { UserRoles } from './user-roles.model';
import { Includeable } from 'sequelize/types/model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
    @InjectModel(User) private userRepository: typeof User,
  ) {}
  async all() {
    return await this.roleRepository.findAll();
  }
  async userRolesById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: { all: true },
    });
    if (!user) {
      throw new HttpException(
        'Пользователь не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.roles;
  }

  async createRole(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.create(createRoleDto);
  }

  async getRoleByValue(value: string, include: Includeable[] = []) {
    return await this.roleRepository.findOne({
      where: { name: value },
      include: include,
    });
  }
  async addRole(dto: AddRoleDto): Promise<Role[]> {
    if (dto.roleName == 'ADMIN' || dto.roleName == 'USER') {
      throw new HttpException(
        `Роль ${dto.roleName} выдать невозможно`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = await this.userRepository.findOne({
      where: { id: dto.id },
      include: { all: true },
    });
    if (!user) {
      throw new HttpException(
        'Пользователь не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.getRoleByValue(dto.roleName);
    if (!role) {
      throw new HttpException(
        'Такой роли не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.roles.find((u) => u.name == role.name)) {
      throw new HttpException(
        'Такая роль уже есть у пользователя',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.roles.find((role: Role) => role.name === dto.roleName)) {
      await user.$add('roles', role.id);
    }
    return (
      await this.userRepository.findOne({
        where: { id: dto.id },
        include: [Role],
      })
    ).roles;
  }
  async removeRole(dto: RemoveRoleDto): Promise<User> {
    if (dto.value == 'ADMIN' || dto.value == 'USER') {
      throw new HttpException(
        `Роль ${dto.value} выдать невозможно`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = await this.userRepository.findOne({
      where: { id: dto.id },
      include: [Role],
    });

    if (!user) {
      throw new HttpException(
        'Пользователь не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.roles) {
      throw new HttpException(
        'У пользователя отсутствуют какие-либо права',
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleToRemove = await this.getRoleByValue(dto.value);
    if (!roleToRemove) {
      throw new HttpException(
        'Такой роли не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.roles.find((role: Role) => role.name === dto.value)) {
      throw new HttpException(
        'Эта роль отсутствует у пользователя',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRoles = user.roles.filter((r) => r.id !== roleToRemove.id);
    await user.$set('roles', userRoles);
    user.roles = userRoles;

    return this.userRepository.findOne({
      where: {
        id: user.id,
      },
      include: [Role],
    });
  }
}
