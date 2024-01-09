import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CharacteristicProduct } from './charactertistics-product/characteristic-product.model';
import { CategoryProduct } from './category/category-product.model';
import { SubCategory } from './category/sub-category.model';

export class CreationProductAttributes {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор товара',
  })
  id: number;

  @ApiProperty({
    example: 'Зеркало',
    description: 'Имя товара',
  })
  name: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Описание',
  })
  description: string;

  @ApiProperty({
    example: 'Кто-кто',
    description: 'Производитель',
  })
  producer: string;

  @ApiProperty({
    example: 'Кто-кто',
    description: 'Производитель в короткой форме',
  })
  shortProducer: string;

  @ApiProperty({
    example: 'Китай',
    description: 'Старана производителя',
  })
  countryProducer: string;

  @ApiProperty({
    example: 'symbol-code',
    description: 'symbol code',
  })
  symbolCode: string;

  @ApiProperty({
    example: 1000,
    description: 'Кол-во в упаковке',
  })
  countInPackage: number;

  @ApiProperty({
    example: true,
    description: 'Видно ли товар',
  })
  visible: boolean;

  @ApiProperty({
    example: true,
    description: 'Являетя ли товар рекомендуемым',
  })
  isRecommended: boolean;
}

@Table({ tableName: 'product', createdAt: true, updatedAt: true })
export class Product extends Model<CreationProductAttributes> {
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
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  producer: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  shortProducer: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  countryProducer: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  symbolCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  countInPackage: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  visible: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isRecommended: boolean;

  @HasMany(() => CharacteristicProduct, 'productId')
  characteristicProducts: CharacteristicProduct[];

  @BelongsToMany(() => SubCategory, () => CategoryProduct)
  categories: SubCategory[];
}
