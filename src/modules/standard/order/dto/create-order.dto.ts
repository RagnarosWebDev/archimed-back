import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  productCharacteristicsId: number;

  @ApiProperty({
    example: 1,
    description: 'Количетсво',
  })
  count: number;
}
export class CreateOrderDto {
  @ApiProperty({
    example: [
      {
        productCharacteristicsId: 1,
        count: 1,
      },
    ],
    type: [OrderItem],
  })
  items: OrderItem[];

  @ApiProperty({
    example: '123',
    description: 'Кому',
  })
  why: string;

  @ApiProperty({
    example: '123',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: '123',
    description: 'Телефон',
  })
  phone: string;
}
