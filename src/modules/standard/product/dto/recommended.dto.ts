import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecommendedDto {
  @ApiProperty({
    example: 5,
    description: 'Пагинация',
  })
  itemsCount: number;

  @ApiPropertyOptional({
    example: '123',
    description: 'Создатель',
  })
  producer?: string;

  @ApiPropertyOptional({
    example: 'asd',
    description: 'Country',
  })
  country?: string;
}
