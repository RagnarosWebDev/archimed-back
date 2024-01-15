import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { Product } from '../product.model';
import { CategoryProduct } from './category-product.model';

export class CategoryCreationAttributes {
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
    example: [],
    description: 'Подкатегории',
  })
  subCategories: CategoryCreationAttributes[];

  @ApiProperty({
    example: [],
    description: 'Родительская категория',
  })
  parentCategory: CategoryCreationAttributes;

  @ApiPropertyOptional({
    example: 1,
    description: '123',
  })
  parentCategoryId?: number;

  @ApiProperty({
    example: '123',
    description: 'symbol-code',
  })
  symbolCode: string;

  @ApiProperty({
    example: '123',
    description: 'template Title',
  })
  templateTitle: string;

  @ApiProperty({
    example: '123',
    description: 'template description',
  })
  templateDescription: string;

  @ApiProperty({
    example: true,
    description: 'is indexing',
  })
  isIndexing: boolean;
}

@Table({ tableName: 'category', createdAt: false, updatedAt: false })
export class Category extends Model<CategoryCreationAttributes> {
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
  symbolCode: string;

  @BelongsToMany(() => Product, () => CategoryProduct)
  products: Product[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  templateTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  templateDescription: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isIndexing: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Category)
  parentCategoryId?: number;

  @HasMany(() => Category, 'parentCategoryId')
  subCategories: Category[];

  @BelongsTo(() => Category, 'parentCategoryId')
  parentCategory?: Category;
}
