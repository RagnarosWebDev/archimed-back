import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.model';
import { OrderValue } from './order-value.model';

@Table({ tableName: 'order', createdAt: true, updatedAt: false })
export class Order extends Model<Order> {
  @ApiProperty({
    example: 1,
    description: 'Id',
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => OrderValue, 'orderId')
  orderValues: OrderValue[];
}
