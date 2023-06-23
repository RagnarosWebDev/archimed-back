import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Test',
    description: 'Логин пользователя(если пользователь не вошел)',
  })
  readonly email: string;

  @ApiProperty({
    example: '+79156471885',
    description: 'Номер телефона(если пользователь не вошел)',
  })
  phone: string;

  @ApiProperty({
    example: 'Тест Тестович',
    description: 'Имя и фамилия(если пользователь не вошел)',
  })
  fullName: string;

  @ApiProperty({
    example: Array.of<CreateOrderItemDto>({
      productVariantId: 1,
      count: 1,
    }),
    description: 'Имя и фамилия(если пользователь не вошел)',
  })
  products: CreateOrderItemDto[];
}

class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Id вариации продукта',
  })
  productVariantId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Кол-во',
  })
  count: number;
}

export interface UserDto {
  email: string;
  phone: string;
  fullName: string;
}
