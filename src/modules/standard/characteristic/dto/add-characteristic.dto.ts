import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCharacteristicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '10 гр',
    description: 'Новое значение характеристики',
  })
  readonly characteristic: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Id типа характеристики',
  })
  readonly typeId: number;
}
