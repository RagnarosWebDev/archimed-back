import { ApiProperty } from '@nestjs/swagger';

export class EditRecommendedDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: true,
    description: 'Является ли рекомендацией',
  })
  isRecommended: boolean;
}
