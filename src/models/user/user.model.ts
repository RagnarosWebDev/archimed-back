import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.model';
import { Order } from '../order/order.model';

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User> {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  id: number;

  @ApiProperty({
    example: '+79156471885',
    description: 'Номер телефона',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Почта',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: 'Тест Тестович',
    description: 'Имя и фамилия',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @ApiProperty({
    example: 'Сайт',
    description: 'Сайт',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Хз что это',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  storeAddress: string;

  @ApiProperty({
    example: 'Россия',
    description: 'Страна',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @ApiProperty({
    example: 'Спб',
    description: 'Город',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

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
    example: Role.USER,
    description: 'Роль',
  })
  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
  })
  role: Role;

  @HasMany(() => Order, 'userId')
  orders: Order[];
}
