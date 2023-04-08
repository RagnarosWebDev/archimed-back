import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.model';
import { UserRoles } from './user-roles.model';

@Table({ tableName: 'roles', createdAt: false, updatedAt: false })
export class Role extends Model<Role> {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор роли',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Значение роли пользователя',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
