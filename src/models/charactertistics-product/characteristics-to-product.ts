import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CharacteristicProduct } from './characteristic-product.model';
import { Characteristic } from '../characteristics/characteristic.model';

@Table({
  tableName: 'product-characteristic-variants',
  createdAt: false,
  updatedAt: false,
})
export class CharacteristicsToProduct extends Model<CharacteristicsToProduct> {
  @ApiProperty({
    example: '1',
    description: 'Id',
  })
  id: number;

  @ForeignKey(() => CharacteristicProduct)
  @Column
  productWithCharacteristicsId: number;

  @ForeignKey(() => Characteristic)
  @Column
  characteristicsId: number;
}
