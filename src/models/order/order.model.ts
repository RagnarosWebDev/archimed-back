import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { OrderProduct } from './order.product.model';
import { CharacteristicProduct } from '../charactertistics-product/characteristic-product.model';

export class OrderCreationAttributes {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: '123',
    description: 'Кому',
  })
  why: string;

  @ApiProperty({
    example: '123',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: '123',
    description: 'Телефон',
  })
  phone: string;

  @ApiProperty({
    example: 12,
    description: 'Id user',
  })
  userId?: number;

  @ApiProperty({
    example: 123,
    description: 'Сумма',
  })
  sum: number;
}
@Table({ tableName: 'order', createdAt: true, updatedAt: false })
export class Order extends Model<Order> {
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  why: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  sum: number;

  @Column
  @ForeignKey(() => User)
  userId?: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsToMany(() => CharacteristicProduct, () => OrderProduct)
  products: CharacteristicProduct[];
}
