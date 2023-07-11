import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { User } from '../users/user.model';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { Role } from '../users/role.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Order } from './order.model';

@ApiBearerAuth()
@ApiTags('Заказы')
@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Создать зазаз' })
  @ApiResponse({ status: 200, type: User })
  @Post('/order')
  order(@Body() dto: CreateOrderDto, @Req() req: Request) {
    let userId = null;
    try {
      userId = this.jwtService.verify(
        req.headers.authorization.split(' ')[1],
      ).id;
    } catch (e) {}
    return this.orderService.createOrder(dto, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'История заказов' })
  @ApiResponse({ status: 200, type: [Order] })
  @Get('/history')
  history(@Query('row') row: number, @Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.orderService.history(user.id, row);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Список всех заказов' })
  @ApiResponse({ status: 200, type: [Order] })
  @Get('/')
  orders(@Query('row') row: number) {
    return this.orderService.all(row);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Кол-во страниц всех заказов' })
  @ApiResponse({ status: 200 })
  @Get('/countAll')
  countAll() {
    return this.orderService.countAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Кол-во страниц для истории заказов' })
  @ApiResponse({ status: 200 })
  @Get('/countHistory')
  countHistory(@Req() req: Request) {
    const user: User = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.orderService.countHistory(user.id);
  }
}
