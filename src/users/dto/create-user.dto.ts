import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'user@email.com',
    description: 'Почтовый адрес пользователя',
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
}
