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
import { Characteristic } from '../characteristics/characteristic.model';
import { CharacteristicsToProduct } from './characteristics-to-product';
import { Product } from '../product.model';
import { OrderProduct } from '../order/order.product.model';
import { Order } from '../order/order.model';

export class CharacteristicProductCreationAttributes {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  price: number;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  secondPrice: number;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  thirdPrice: number;

  @ApiProperty({
    example: 1000,
    description: 'Кол-во доступно',
  })
  availableCount: number;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  fourthPrice: number;

  @ApiProperty({
    example: 1000,
    description: 'Мин упаковка',
  })
  minCount: number;

  @ApiProperty({
    example: '/data.png',
    description: 'Картинка',
  })
  image: string;

  @ApiProperty({
    example: 1,
    description: 'Id продукты',
  })
  productId: number;
}
@Table({
  tableName: 'product-characteristic',
  createdAt: false,
  updatedAt: false,
})
export class CharacteristicProduct extends Model<CharacteristicProductCreationAttributes> {
  id: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product, 'productId')
  product: Product;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  secondPrice: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  thirdPrice: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  fourthPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  availableCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  minCount: number;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @BelongsToMany(() => Characteristic, () => CharacteristicsToProduct)
  characteristics: Characteristic[];

  @BelongsToMany(() => Order, () => OrderProduct)
  orders: Order[];
}
