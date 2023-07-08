import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
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
    example: ['Вес'],
    description: 'Типы вариантов',
  })
  variants: string[];
  @ApiProperty({
    example: Array.of<CreateVariantsDto>({
      variants: ['КГ'],
      price: 1000,
      count: 100,
      secondPrice: 1000,
      thirdPrice: 100,
    }),
    description: 'Список вариацих и из значений',
  })
  productVariants: CreateVariantsDto[];

  @ApiProperty({
    example: 'Категория',
    description: 'Категория',
  })
  category: string;
}

class CreateVariantsDto {
  @ApiProperty({
    example: ['5гр'],
    description: 'Список из значений вариантов',
  })
  variants: string[];
  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  price: number;
  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  secondPrice: number;
  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  thirdPrice: number;
  @ApiProperty({
    example: 1000,
    description: 'Кол-во',
  })
  count: number;
}
