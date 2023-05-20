import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.model';

@Table({ tableName: 'books', createdAt: true, updatedAt: true })
export class Book extends Model<Book> {
  @ApiProperty({
    example: 1,
    description: 'Id книги',
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'Тест',
    description: 'Название книги',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({
    example: 'Тест',
    description: 'Описание книги',
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty({
    example: ['A', 'B'],
    description: 'Теги книги',
  })
  tags: string[];

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User, 'creatorId')
  creator: User;
}
