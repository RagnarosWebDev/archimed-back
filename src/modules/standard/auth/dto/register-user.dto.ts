import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'Поле e-mail должно быть текстом' })
  @IsNotEmpty({ message: 'Поле e-mail не должно быть пустым' })
  @IsEmail(
    {},
    {
      message: 'Поле e-mail должно быть e-mail',
    },
  )
  @ApiProperty({
    example: 'user@email.com',
    description: 'Почтовый адрес пользователя',
  })
  @ApiProperty({
    example: 'Test',
    description: 'Логин пользователя',
  })
  readonly email: string;

  @IsString({ message: 'Поле пароль должно быть текстом' })
  @IsNotEmpty({ message: 'Поле пароль не должно быть пустым' })
  @MinLength(5, { message: 'Минимальное количество символов в пароле - 5' })
  @ApiProperty({
    example: '12345678',
    description: 'Пароль пользователя',
  })
  readonly password: string;

  @IsString({ message: 'Поле телефон должно быть текстом' })
  @IsNotEmpty({ message: 'Поле телефон не должно быть пустым' })
  @IsPhoneNumber('RU', {
    message: 'В поле телефон можно ввести только телефон',
  })
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

  @IsString({ message: 'Поле страна должно быть текстом' })
  @IsNotEmpty({ message: 'Поле страна не должно быть пустым' })
  @MinLength(2, {
    message: 'Минимальное количество символов для поля страна - 2',
  })
  @ApiProperty({
    example: 'Россия',
    description: 'Страна',
  })
  country: string;

  @IsString({ message: 'Поле город должно быть текстом' })
  @IsNotEmpty({ message: 'Поле город не должно быть пустым' })
  @MinLength(2, {
    message: 'Минимальное количество символов для поля город - 2',
  })
  @ApiProperty({
    example: 'СПБ',
    description: 'Город',
  })
  city: string;
}
