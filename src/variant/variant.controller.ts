import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VariantService } from './variant.service';
import { RolesGuard } from '../auth/roles.guard';
import { Variant } from './variant.model';
import { Roles } from '../auth/roles-auth.decorator';
import { Role } from '../users/role.model';
import { CreateVariantDto } from './dto/create-variant.dto';
import { AddValueVariantDto } from './dto/add-value-variant.dto';
import { ValueVariant } from './value-variant.model';

@ApiBearerAuth()
@ApiTags('variant')
@Controller('variant')
export class VariantController {
  constructor(private variantService: VariantService) {}

  @ApiOperation({ summary: 'Добавить вариант' })
  @ApiResponse({ status: 200, type: Variant })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/addVariant')
  addVariant(@Body() dto: CreateVariantDto): Promise<Variant> {
    return this.variantService.addVariant(dto);
  }
  @ApiOperation({ summary: 'Получить все варианты' })
  @ApiResponse({ status: 200, type: [Variant] })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/all')
  all(): Promise<Variant[]> {
    return this.variantService.all();
  }
  @ApiOperation({ summary: 'Добавить значение к варианту' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/addValueVariant')
  addValueVariant(@Body() dto: AddValueVariantDto): Promise<ValueVariant> {
    return this.variantService.addValueVariant(dto);
  }
}
