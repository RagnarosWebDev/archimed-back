import { ApiProperty } from '@nestjs/swagger';

export class EditImageDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;
}
