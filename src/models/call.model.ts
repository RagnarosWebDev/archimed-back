import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export enum CallStatus {
  accepted = 'accepted',
  completed = 'completed',
  inProgress = 'isProgress',
}

@Table({ tableName: 'call', createdAt: true })
export class Call extends Model<Call> {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: 'Что-то',
    description: 'Полное имя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @ApiProperty({
    example: '+79156471885',
    description: 'Телефон',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({
    example: 'Текст',
    description: 'Тело',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  body: string;

  @ApiProperty({
    example: CallStatus.accepted,
    description: 'Статус',
  })
  @Column({
    type: DataType.ENUM(...Object.values(CallStatus)),
    allowNull: false,
  })
  status: CallStatus;
}
