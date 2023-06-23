import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.model';
import { ProductVariant } from '../product/many/product-variant.model';

@Table({ tableName: 'order-value', createdAt: false, updatedAt: false })
export class OrderValue extends Model<OrderValue> {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty({
    example: 1,
    description: 'кол-во',
  })
  count: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @ForeignKey(() => ProductVariant)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productVariantId: number;

  @BelongsTo(() => ProductVariant, 'productVariantId')
  productVariant: ProductVariant;
}
