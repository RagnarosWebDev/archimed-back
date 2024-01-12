import { ApiProperty } from '@nestjs/swagger';

export class CharacteristicsByIdDto {
  @ApiProperty({
    example: [1, 2],
    description: 'Id категорий',
  })
  names: string[];
}
