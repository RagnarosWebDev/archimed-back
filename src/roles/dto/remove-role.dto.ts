import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ADMIN',
    description: 'Имя роли',
  })
  readonly value: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Id юзера',
  })
  readonly id: number;
}
