import { ApiProperty } from '@nestjs/swagger';

export class EditProductVariantDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: 1000,
    description: 'Остаток',
  })
  count: number;

  @ApiProperty({
    example: 1000,
    description: 'Цена',
  })
  price: number;
}
