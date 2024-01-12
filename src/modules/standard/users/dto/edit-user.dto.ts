import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({
    example: 'Test',
    description: 'Логин пользователя',
  })
  readonly email?: string;

  @ApiProperty({
    example: '12345678',
    description: 'Пароль пользователя',
  })
  readonly password?: string;

  @ApiProperty({
    example: '+79156471885',
    description: 'Номер телефона',
  })
  phone?: string;

  @ApiProperty({
    example: 'Тест Тестович',
    description: 'Имя и фамилия',
  })
  fullName?: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Сайт',
  })
  website?: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Что-то',
  })
  storeAddress?: string;

  @ApiProperty({
    example: 'Россия',
    description: 'Страна',
  })
  country?: string;

  @ApiProperty({
    example: 'СПБ',
    description: 'Город',
  })
  city?: string;
}
