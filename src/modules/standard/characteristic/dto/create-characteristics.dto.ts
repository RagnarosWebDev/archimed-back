import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacteristicsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Вес',
    description: 'Имя характеристики',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: [],
    description: 'Стартовые характеристики',
  })
  readonly characteristics: string[];
}
