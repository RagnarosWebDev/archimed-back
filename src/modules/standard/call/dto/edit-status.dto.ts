import { ApiProperty } from '@nestjs/swagger';
import { CallStatus } from '../../../../models/call.model';

export class EditStatusDto {
  @ApiProperty({
    example: 1,
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    example: CallStatus.accepted,
    description: 'Статус',
  })
  status: CallStatus;
}
