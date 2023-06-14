import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Вес',
    description: 'Имя варианта',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: [],
    description: 'Стартовые варианты',
  })
  readonly variants: string[];
}
