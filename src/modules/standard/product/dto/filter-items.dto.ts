import { ApiProperty } from '@nestjs/swagger';

export class FilterItemsDto {
  @ApiProperty({
    example: [],
    description: 'Создатели',
  })
  producers: string[];

  @ApiProperty({
    example: [],
    description: 'Страны',
  })
  country: string[];
}
