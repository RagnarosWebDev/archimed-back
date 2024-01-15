import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicType } from '../../../models/characteristics/characteristic-type.model';
import { CreateCharacteristicsDto } from './dto/create-characteristics.dto';
import { AddCharacteristicDto } from './dto/add-characteristic.dto';
import { Characteristic } from '../../../models/characteristics/characteristic.model';
import { RolesGuard } from '../../../utils/roles.guard';
import { Roles } from '../../../utils/roles-auth.decorator';
import { Role } from '../../../models/user/role.model';
import { CharacteristicsByIdDto } from './dto/characteristics-by-id.dto';
import { AllByIdsDto } from './dto/all-by-ids.dto';
import { TypedBody } from '../../../utils/auth-data.decorator';
import { Product } from '../../../models/product.model';

@ApiBearerAuth()
@ApiTags('characteristic')
@Controller('characteristic')
export class CharacteristicController {
  constructor(private characteristicService: CharacteristicService) {}

  @ApiOperation({ summary: 'Добавить вариант' })
  @ApiResponse({ status: 200, type: CharacteristicType })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/')
  create(@Body() dto: CreateCharacteristicsDto): Promise<CharacteristicType> {
    return this.characteristicService.create(dto);
  }
  @ApiOperation({ summary: 'Добавить значение к варианту' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/addCharacteristic')
  addCharacteristic(
    @Body() dto: AddCharacteristicDto,
  ): Promise<Characteristic> {
    return this.characteristicService.addCharacteristic(dto);
  }

  @ApiOperation({ summary: 'Добавить продукты с вариантами по ids' })
  @ApiResponse({ status: 200 })
  @Post('/getProductByIds')
  @ApiBody({ type: AllByIdsDto })
  getProductByIds(
    @TypedBody(AllByIdsDto) dto: AllByIdsDto,
  ): Promise<Product[]> {
    return this.characteristicService.getAllProductIds(dto.ids);
  }

  @ApiOperation({ summary: 'Получить категории по именам' })
  @ApiResponse({ status: 200, type: [CharacteristicType] })
  @Post('/list')
  list(@Body() dto: CharacteristicsByIdDto): Promise<CharacteristicType[]> {
    return this.characteristicService.getByIds(dto.names);
  }

  @ApiOperation({ summary: 'Получить все варианты' })
  @ApiResponse({ status: 200, type: [CharacteristicType] })
  @Get('/')
  all(): Promise<CharacteristicType[]> {
    return this.characteristicService.all();
  }
}
