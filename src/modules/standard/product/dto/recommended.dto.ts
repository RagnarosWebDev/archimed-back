import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { RowDto } from '../../../../utils/row.dto';

export class RecommendedDto {
  @ApiProperty({
    example: 5,
    description: 'Пагинация',
  })
  pageCount: number;
}

export class GetByCategoryDto extends IntersectionType(RecommendedDto, RowDto) {
  @ApiProperty({
    example: 'asd',
    description: 'Категории',
  })
  category: string;
}
