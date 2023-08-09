import { ApiProperty } from '@nestjs/swagger';

export class EditProductVariantDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

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
    description: 'Цена',
  })
  fourthPrice: number;
  @ApiProperty({
    example: 1000,
    description: 'Кол-во',
  })
  availableCount: number;

  @ApiProperty({
    example: 1000,
    description: 'Мин упаковка',
  })
  minCount: number;
}
