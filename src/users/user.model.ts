import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.model';
import { UserRoles } from '../roles/user-roles.model';
import { Book } from '../book/book.model';

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User> {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  id: number;

  @ApiProperty({
    example: 'user@email.com',
    description: 'Логин пользователя',
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

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Book, 'creatorId')
  createdBooks: Book[];
}
