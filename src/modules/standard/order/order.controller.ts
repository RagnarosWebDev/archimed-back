import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { RolesGuard } from '../../../utils/roles.guard';
import { Roles } from '../../../utils/roles-auth.decorator';
import { Role } from '../../../models/user/role.model';
import { TypedBody } from '../../../utils/auth-data.decorator';
import { OrderCreationAttributes } from '../../../models/order/order.model';
import { CreateOrderDto } from './dto/create-order.dto';

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
  @Roles(Role.ADMIN)
  create(
    @TypedBody(CreateOrderDto) dto: CreateOrderDto,
  ): Promise<OrderCreationAttributes> {
    return this.productService.createProduct(dto);
  }
}
