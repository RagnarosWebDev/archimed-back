import { ApiProperty } from '@nestjs/swagger';

export class CategoriesByIdDto {
  @ApiProperty({
    example: [1, 2],
    description: 'Id категорий',
  })
  categoriesId: number[];
}
