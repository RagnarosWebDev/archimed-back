import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class BanDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Id пользователя',
  })
  userId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Попытка взлома системы',
    description: 'Причина бана',
  })
  message: string;
  constructor(userId: number, message: string) {
    this.userId = userId;
    this.message = message;
  }
}
