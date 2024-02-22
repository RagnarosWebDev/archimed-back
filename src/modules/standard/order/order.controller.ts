import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { RolesGuard } from '../../../utils/roles.guard';
import { NotRequired, Roles } from '../../../utils/roles-auth.decorator';
import { Auth, TypedBody } from '../../../utils/auth-data.decorator';
import { OrderCreationAttributes } from '../../../models/order/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { TokenDto } from '../../../utils/token.dto';
import { Role } from '../../../models/user/role.model';
import { RowDto } from '../../../utils/row.dto';

@Controller('order')
@ApiTags('order')
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiOperation({ summary: 'Список заказ' })
  @ApiResponse({ status: 200, type: [OrderCreationAttributes] })
  @Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: RowDto })
  list(@TypedBody(RowDto) dto: RowDto): Promise<OrderCreationAttributes[]> {
    return this.orderService.list(dto);
  }

  @ApiOperation({ summary: 'Количество заказов' })
  @ApiResponse({ status: 200, type: [OrderCreationAttributes] })
  @Post('/count')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  countAll() {
    return this.orderService.countAll();
  }

  @ApiOperation({ summary: 'Создать заказ' })
  @ApiResponse({ status: 200, type: OrderCreationAttributes })
  @Post('/create')
  @ApiBody({
    type: CreateOrderDto,
  })
  @UseGuards(RolesGuard)
  @NotRequired()
  create(
    @TypedBody(CreateOrderDto) dto: CreateOrderDto,
    @Auth() user?: TokenDto,
  ): Promise<OrderCreationAttributes> {
    return this.orderService.createOrder(dto, user?.id);
  }
}
