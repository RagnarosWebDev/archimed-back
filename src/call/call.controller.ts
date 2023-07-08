import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CallService } from './call.service';
import { Call } from './call.model';
import { CreateCallDto } from './dto/create-call.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { Role } from '../users/role.model';
import { EditStatusDto } from './dto/edit-status.dto';

@Controller('call')
@ApiTags('обратная связь')
@ApiBearerAuth()
export class CallController {
  constructor(private callService: CallService) {}

  @ApiOperation({ summary: 'Создать запись' })
  @ApiResponse({ status: 200, type: Call })
  @Post('/create')
  order(@Body() dto: CreateCallDto) {
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

  @ApiOperation({ summary: 'Изменить статус' })
  @ApiResponse({ status: 200, type: Call })
  @Put('/changeStatus')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  changeStatus(@Body() dto: EditStatusDto) {
    return this.callService.changeStatus(dto);
  }
}
