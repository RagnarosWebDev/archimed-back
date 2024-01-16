import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { RolesGuard } from '../../../utils/roles.guard';
import { NotRequired } from '../../../utils/roles-auth.decorator';
import { Auth, TypedBody } from '../../../utils/auth-data.decorator';
import { OrderCreationAttributes } from '../../../models/order/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { TokenDto } from '../../../utils/token.dto';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

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
