import { ApiProperty } from '@nestjs/swagger';

export class CategoriesByNamesDto {
  @ApiProperty({
    example: [''],
    description: 'Имена категорий',
  })
  categoriesId: string[];
}
