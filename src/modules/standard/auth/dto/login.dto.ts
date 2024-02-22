import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString({ message: 'Поле e-mail должно быть текстом' })
  @IsNotEmpty({ message: 'Поле e-mail не должно быть пустым' })
  @ApiProperty({
    example: 'user@email.com',
    description: 'Почтовый адрес пользователя',
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
}
