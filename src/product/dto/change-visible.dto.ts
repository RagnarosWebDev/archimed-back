import { ApiProperty } from '@nestjs/swagger';

export class ChangeVisibleDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: true,
    description: 'Скрыт товар или нет',
  })
  visible: boolean;
}
