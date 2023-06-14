import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ProductVariant } from './many/product-variant.model';
import { Variant } from '../variant/variant.model';
import { ProductVariantTable } from './many/product-variant-table';

@Table({ tableName: 'product', createdAt: true, updatedAt: true })
export class Product extends Model<Product> {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор товара',
  })
  id: number;

  @ApiProperty({
    example: 'Зеркало',
    description: 'Имя товара',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Описание',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({
    example: 'Кто-кто',
    description: 'Производитель',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  producer: string;

  @ApiProperty({
    example: 'Кто-кто',
    description: 'Производитель в короткой форме',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  shortProducer: string;

  @ApiProperty({
    example: 'Китай',
    description: 'Старана производителя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  countryProducer: string;

  @ApiProperty({
    example: 1000,
    description: 'Кол-во в упаковке',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  count: number;

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty({
    example: '/data.png',
    description: 'Картинка',
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty({
    example: true,
    description: 'Являетя ли товар рекомендуемым',
  })
  isRecommended: boolean;

  @HasMany(() => ProductVariant, 'productId')
  productVariants: ProductVariant[];

  @BelongsToMany(() => Variant, () => ProductVariantTable)
  variants: Variant[];
}
