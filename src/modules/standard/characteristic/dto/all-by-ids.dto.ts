import { ApiProperty } from '@nestjs/swagger';

export class AllByIdsDto {
  @ApiProperty({
    example: [1],
    description: 'ids',
  })
  ids: number[];
}
