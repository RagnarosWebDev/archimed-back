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
    example: ['Категории'],
    description: 'Категории',
  })
  category: string[];

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
  count: number;

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
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  category: string[];

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
  count: number;

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

  @HasMany(() => ProductVariant, 'productId')
  productVariants: ProductVariant[];

  @BelongsToMany(() => Variant, () => ProductVariantTable)
  variants: Variant[];
}

export type BaseData = Record<string, string[]>;
