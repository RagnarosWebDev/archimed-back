import { Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { EditStatusDto } from './dto/edit-status.dto';
import { Call } from '../../../models/call.model';
import { RolesGuard } from '../../../utils/roles.guard';
import { Roles } from '../../../utils/roles-auth.decorator';
import { Role } from '../../../models/user/role.model';
import { TypedBody } from '../../../utils/auth-data.decorator';
import { CountDto } from '../../../utils/count-dto';

@Controller('call')
@ApiTags('обратная связь')
@ApiBearerAuth()
export class CallController {
  constructor(private callService: CallService) {}

  @ApiOperation({ summary: 'Создать запись' })
  @ApiResponse({ status: 200, type: Call })
  @Post('/create')
  @ApiBody({ type: CreateCallDto })
  order(@TypedBody(CreateCallDto) dto: CreateCallDto) {
    return this.callService.create(dto);
  }

  @ApiOperation({ summary: 'Посмотреть записи' })
  @ApiResponse({ status: 200, type: [Call] })
  @Get('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  all(@Query('row') row: number) {
    return this.callService.all(row);
  }

  @ApiOperation({ summary: 'Посмотреть записи' })
  @ApiResponse({ status: 200, type: CountDto })
  @Get('/count')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  count(): Promise<CountDto> {
    return this.callService.count();
  }

  @ApiOperation({ summary: 'Изменить статус' })
  @ApiResponse({ status: 200, type: Call })
  @Put('/changeStatus')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: EditStatusDto })
  changeStatus(@TypedBody(EditStatusDto) dto: EditStatusDto) {
    return this.callService.changeStatus(dto);
  }
}
