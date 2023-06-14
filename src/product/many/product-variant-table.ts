import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from '../product.model';
import { Variant } from '../../variant/variant.model';

@Table({
  tableName: 'product-variant-table',
  createdAt: false,
  updatedAt: false,
})
export class ProductVariantTable extends Model<ProductVariantTable> {
  @Column({
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => Variant)
  @Column
  variantId: number;
}
