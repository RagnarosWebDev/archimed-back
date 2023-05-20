import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
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
