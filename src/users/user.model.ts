import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.model';
import { UserRoles } from '../roles/user-roles.model';
import { Code } from '../auth/code.model';
import { PrimaryGeneratedColumn } from 'typeorm';

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User> {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@email.com',
    description: 'Почтовый адрес пользователя',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Пароль пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    example: true,
    description: 'Забанен пользователь или нет',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  banned: boolean;

  @ApiProperty({
    example: 'Нарушение правил сообщества',
    description: 'Причина бана пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  banReason: string;

  @ForeignKey(() => Code)
  @Column
  verifyId: number;
  @ForeignKey(() => Code)
  @Column
  resetId: number;
  @BelongsTo(() => Code, 'verifyId')
  verify: Code;
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
  @BelongsTo(() => Code, 'resetId')
  reset: Code;
}
