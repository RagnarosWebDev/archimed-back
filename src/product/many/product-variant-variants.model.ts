import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ProductVariant } from './product-variant.model';
import { ValueVariant } from '../../variant/value-variant.model';

@Table({
  tableName: 'product-variant-variants',
  createdAt: false,
  updatedAt: false,
})
export class ProductVariantVariants extends Model<ProductVariantVariants> {
  @ApiProperty({
    example: '1',
    description: 'Id инфы',
  })
  id: number;

  @ForeignKey(() => ProductVariant)
  @Column
  productVariantId: number;

  @ForeignKey(() => ValueVariant)
  @Column
  valueVariant: number;
}
