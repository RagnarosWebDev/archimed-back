import { ApiProperty } from '@nestjs/swagger';

export class CountDto {
  @ApiProperty({
    example: 1,
    description: 'count',
  })
  pages: number;
}
