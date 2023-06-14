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
import { Variant } from './variant.model';
import { ProductVariantVariants } from '../product/many/product-variant-variants.model';
import { ProductVariant } from '../product/many/product-variant.model';

@Table({ tableName: 'value-variant', createdAt: false, updatedAt: false })
export class ValueVariant extends Model<ValueVariant> {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: '5 гр',
    description: 'Имя значения варианта',
  })
  variantValue: string;

  @ForeignKey(() => Variant)
  @Column
  variantId: number;

  @ApiProperty({
    example: [],
    description: 'Вариант',
  })
  @BelongsTo(() => Variant, 'variantId')
  variant: Variant;

  @BelongsToMany(() => ProductVariant, () => ProductVariantVariants)
  productVariants: ProductVariant[];
}
