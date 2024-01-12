import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SubCategory } from './sub-category.model';
import { Product } from '../product.model';

@Table({ tableName: 'category-products', createdAt: false, updatedAt: false })
export class CategoryProduct extends Model<CategoryProduct> {
  id: number;

  @ForeignKey(() => SubCategory)
  @Column({
    type: DataType.NUMBER,
  })
  categoryId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.NUMBER,
  })
  productId: number;
}
