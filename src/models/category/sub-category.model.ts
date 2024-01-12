import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../product.model';
import { CategoryProduct } from './category-product.model';

export class SubCategoryCreationAttributes {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: 'name',
    description: 'Категория',
  })
  name: string;

  @ApiProperty({
    example: 'Кат',
    description: 'Имя общей категории',
  })
  categoryName: string;
}

@Table({ tableName: 'category', createdAt: false, updatedAt: false })
export class SubCategory extends Model<SubCategoryCreationAttributes> {
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  categoryName: string;

  @BelongsToMany(() => Product, () => CategoryProduct)
  products: Product[];
}
