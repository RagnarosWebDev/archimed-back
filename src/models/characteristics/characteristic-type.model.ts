import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Characteristic } from './characteristic.model';

@Table({ tableName: 'characteristic', createdAt: false, updatedAt: false })
export class CharacteristicType extends Model<CharacteristicType> {
  @ApiProperty({
    example: 1,
    description: 'Id характеристики',
  })
  id: number;

  @ApiProperty({
    example: 'Вес',
    description: 'Название характеристики',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Characteristic, 'characteristicId')
  characteristics: Characteristic[];
}
