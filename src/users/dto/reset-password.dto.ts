import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: '12345678',
    description: 'Новый пароль',
  })
  readonly password: string;
  @IsNumber()
  @ApiProperty({
    example: 1283,
    description: 'Код восстановления',
  })
  readonly resetCode: number;
}
