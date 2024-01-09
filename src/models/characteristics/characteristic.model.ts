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
import { CharacteristicType } from './characteristic-type.model';
import { CharacteristicsToProduct } from '../charactertistics-product/characteristics-to-product';
import { CharacteristicProduct } from '../charactertistics-product/characteristic-product.model';

@Table({
  tableName: 'value-characteristic',
  createdAt: false,
  updatedAt: false,
})
export class Characteristic extends Model<Characteristic> {
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
    description: 'Имя характеристики',
  })
  name: string;

  @ForeignKey(() => CharacteristicType)
  @Column
  characteristicId: number;

  @ApiProperty({
    example: [],
    description: 'Вариант',
  })
  @BelongsTo(() => CharacteristicType, 'characteristicId')
  type: CharacteristicType;

  @BelongsToMany(() => CharacteristicProduct, () => CharacteristicsToProduct)
  productVariants: CharacteristicProduct[];
}
