import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Тест',
    description: 'Название книги',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Тест',
    description: 'Описание книги',
  })
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: ['A', 'B'],
    description: 'Теги книги',
  })
  tags: string[];
}
