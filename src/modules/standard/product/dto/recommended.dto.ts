import { ApiProperty } from '@nestjs/swagger';

export class RecommendedDto {
  @ApiProperty({
    example: 5,
    description: 'Пагинация',
  })
  pageCount: number;
}
