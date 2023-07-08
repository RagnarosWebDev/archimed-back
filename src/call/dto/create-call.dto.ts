import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCallDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Что-то',
    description: 'Полное имя',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '+79156471885',
    description: 'Телефон',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Текст',
    description: 'Тело',
  })
  body: string;
}
