import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ValueVariant } from './value-variant.model';
import { ProductVariantTable } from '../product/many/product-variant-table';
import { Product } from '../product/product.model';

@Table({ tableName: 'variant', createdAt: false, updatedAt: false })
export class Variant extends Model<Variant> {
  @ApiProperty({
    example: 1,
    description: 'Id варианта',
  })
  id: number;

  @ApiProperty({
    example: 'Вес',
    description: 'Название варианта',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @HasMany(() => ValueVariant, 'variantId')
  values: ValueVariant[];

  @BelongsToMany(() => Product, () => ProductVariantTable)
  products: Product[];
}
