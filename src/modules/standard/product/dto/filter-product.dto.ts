import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { RowDto } from '../../../../utils/row.dto';

export class FilterProductDto extends RowDto {
  @ApiProperty({
    example: 5,
    description: 'Количество элементов',
  })
  itemsCount: number;

  @ApiPropertyOptional({
    example: 'asd',
    description: 'Категория',
  })
  category?: string;

  @ApiPropertyOptional({
    example: 'Китай',
    description: 'Страна',
  })
  country?: string;

  @ApiPropertyOptional({
    example: 'asd',
    description: 'Запрос на поиск',
  })
  query?: string;

  @ApiPropertyOptional({
    example: 'Кто-кто',
    description: 'Производитель',
  })
  producer?: string;
}

export class FilterUnRowedProductDto extends OmitType(FilterProductDto, [
  'row',
]) {}
