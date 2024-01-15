import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  CreationProductAttributes,
  Product,
} from '../../../models/product.model';
import {
  FilterProductDto,
  FilterUnRowedProductDto,
} from './dto/filter-product.dto';
import { CountDto } from '../../../utils/count-dto';
import { CreateProductDto } from './dto/create-product.dto';
import { TypedBody } from '../../../utils/auth-data.decorator';
import { RecommendedDto } from './dto/recommended.dto';
import { RolesGuard } from '../../../utils/roles.guard';
import { Roles } from '../../../utils/roles-auth.decorator';
import { Role } from '../../../models/user/role.model';
import { UploadImageDto } from './dto/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileOption } from '../../../utils/files';
import { FilterItemsDto } from './dto/filter-items.dto';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Получить продукт по symbol code' })
  @ApiResponse({ status: 200, type: Product })
  @Get('/getBySymbolCode')
  getBySymbolCode(
    @Query('symbolCode') symbolCode: string,
  ): Promise<CreationProductAttributes> {
    return this.productService.getBySymbolCode(symbolCode);
  }

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({ status: 200, type: [Product] })
  @Post('/')
  @ApiBody({ type: FilterProductDto })
  filter(
    @TypedBody(FilterProductDto) dto: FilterProductDto,
  ): Promise<Product[]> {
    return this.productService.getAll(dto);
  }

  @ApiOperation({ summary: 'Получить фильтры' })
  @ApiResponse({ status: 200, type: FilterItemsDto })
  @Get('/filterItems')
  filterItems() {
    return this.productService.filterItems();
  }

  @ApiOperation({ summary: 'Получить категории фильтрованно' })
  @ApiResponse({ status: 200, type: [Product] })
  @ApiBody({ type: RecommendedDto })
  @Post('/groupedByCategory')
  groupByCategories(
    @TypedBody(RecommendedDto) dto: RecommendedDto,
  ): Promise<Record<string, Product[]>> {
    return this.productService.groupByCategories(dto);
  }

  @ApiOperation({ summary: 'Создать продукт' })
  @ApiResponse({ status: 200, type: Product })
  @Post('/create')
  @ApiBody({
    type: CreateProductDto,
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@TypedBody(CreateProductDto) dto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(dto);
  }
  @ApiOperation({ summary: 'Список рекомендуемых продуктов' })
  @ApiResponse({ status: 200, type: CountDto })
  @Post('/count')
  @ApiBody({ type: FilterUnRowedProductDto })
  async count(
    @TypedBody(FilterUnRowedProductDto) dto: FilterUnRowedProductDto,
  ): Promise<CountDto> {
    return this.productService.countAll(dto);
  }

  @ApiOperation({ summary: 'Список символьных кодов' })
  @ApiResponse({ status: 200, type: [CreationProductAttributes] })
  @Get('/getAllSymbolCodes')
  async getAllSymbolCodes(): Promise<Product[]> {
    return this.productService.getAllSymbolCodes();
  }

  @ApiOperation({ summary: 'обновить картинку продукта' })
  @ApiResponse({ status: 200, type: Product })
  @Post('/updateImage')
  @UseGuards(RolesGuard)
  @ApiConsumes('multipart/form-data')
  @Roles(Role.ADMIN)
  @ApiBody({ type: UploadImageDto })
  @UseInterceptors(
    FileInterceptor('image', {
      ...fileOption,
    }),
  )
  async updateImage(@TypedBody(UploadImageDto) dto: UploadImageDto) {
    return this.productService.updateImage(dto);
  }
}
