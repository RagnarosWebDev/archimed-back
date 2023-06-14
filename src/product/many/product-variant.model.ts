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
import { ValueVariant } from '../../variant/value-variant.model';
import { ProductVariantVariants } from './product-variant-variants.model';
import { Product } from '../product.model';

@Table({ tableName: 'product-variant', createdAt: false, updatedAt: false })
export class ProductVariant extends Model<ProductVariant> {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product, 'productId')
  product: Product;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @ApiProperty({
    example: 1000,
    description: 'Кол-во доступно',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  availableCount: number;

  @BelongsToMany(() => ValueVariant, () => ProductVariantVariants)
  valueVariants: ValueVariant[];
}
