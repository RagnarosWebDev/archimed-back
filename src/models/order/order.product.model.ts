import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { CharacteristicProduct } from '../charactertistics-product/characteristic-product.model';

@Table({ tableName: 'order-product', createdAt: false, updatedAt: false })
export class OrderProduct extends Model<OrderProduct> {
  id: number;

  @Column
  @ForeignKey(() => Order)
  orderId: number;

  @Column
  @ForeignKey(() => CharacteristicProduct)
  characteristicsProductId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  count: number;
}
