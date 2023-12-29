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
import { ValueVariant } from '../../variant/value-variant.model';
import { ProductVariantVariants } from './product-variant-variants.model';
import { Product } from '../product.model';
import { OrderValue } from '../../order/order-value.model';

export class CreationProductVariantCreationAttributes {
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
    description: 'Мин упаковка',
  })
  minCount: number;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  fourthPrice: number;

  @ApiProperty({
    example: '/data.png',
    description: 'Картинка',
  })
  image: string;

  productId: number;
}
@Table({ tableName: 'product-variant', createdAt: false, updatedAt: false })
export class ProductVariant extends Model<CreationProductVariantCreationAttributes> {
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
    type: DataType.DOUBLE,
    allowNull: false,
  })
  fourthPrice: number;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @BelongsToMany(() => ValueVariant, () => ProductVariantVariants)
  valueVariants: ValueVariant[];

  @HasMany(() => OrderValue, 'productVariantId')
  orderValues: OrderValue[];
}
