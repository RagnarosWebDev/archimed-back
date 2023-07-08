import { ApiProperty } from '@nestjs/swagger';

export class EditProductDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;
  @ApiProperty({
    example: 'А',
    description: 'Имя',
  })
  name: string;
  @ApiProperty({
    example: 'Описание',
    description: 'Описание товара',
  })
  description: string;
  @ApiProperty({
    example: 'Производитель',
    description: 'Производитель',
  })
  producer: string;
  @ApiProperty({
    example: 'Производитель',
    description: 'Короткое имя производителя',
  })
  shortProducer: string;
  @ApiProperty({
    example: 'Китай',
    description: 'Страна производителя',
  })
  countryProducer: string;
  @ApiProperty({
    example: 100,
    description: 'Кол-во в упаковке',
  })
  count: number;
  @ApiProperty({
    example: true,
    description: 'Рекомендованный ли товар?',
  })
  isRecommended: boolean;
  @ApiProperty({
    example: 'Категория',
    description: 'Категория',
  })
  category: string;
}
