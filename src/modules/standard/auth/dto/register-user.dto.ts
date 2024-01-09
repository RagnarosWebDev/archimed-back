import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'Test',
    description: 'Логин пользователя',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: '12345678',
    description: 'Пароль пользователя',
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({
    example: '+79156471885',
    description: 'Номер телефона',
  })
  phone: string;

  @ApiProperty({
    example: 'Тест Тестович',
    description: 'Имя и фамилия',
  })
  fullName: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Сайт',
  })
  website?: string;

  @ApiProperty({
    example: 'Что-то',
    description: 'Что-то',
  })
  storeAddress: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    example: 'Россия',
    description: 'Страна',
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    example: 'СПБ',
    description: 'Город',
  })
  city: string;
}
