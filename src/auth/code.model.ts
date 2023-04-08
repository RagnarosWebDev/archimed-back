import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.model';
export enum CodeType {
  VERIFY = 'VERIFY',
  RESET = 'RESET',
}
@Table({ tableName: 'codes', createdAt: false, updatedAt: false })
export class Code extends Model<Code> {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор кода',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({
    example: 'RESET',
    description: 'Тип кода',
  })
  @Column({
    type: DataType.ENUM(...Object.values(CodeType)),
    allowNull: false,
  })
  type: CodeType;

  @ApiProperty({
    example: 1023,
    description: 'Уникальный код',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  code: number;

  @HasOne(() => User, 'verifyId')
  verifyUser: User;

  @HasOne(() => User, 'resetId')
  resetUser: User;
}
