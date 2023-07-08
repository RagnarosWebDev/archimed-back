import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { Role } from '../users/role.model';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { ProductVariant } from './many/product-variant.model';
import { EditProductVariantDto } from './dto/edit-product-variant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Добавить продукт' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/addProduct')
  @UseInterceptors(FileInterceptor('image'))
  addProduct(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(dto);
  }

  @ApiOperation({ summary: 'Загрузить картинку' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/uploadImageToProduct')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageToProduct(
    @Query('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/png' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Product> {
    const fileName = 'images/' + Date.now() + '.png';
    fs.writeFileSync(fileName, file.buffer);
    return this.productService.updateImage(id, fileName);
  }

  @ApiOperation({ summary: 'Список продуктов' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/list')
  list(
    @Query('from') from: number,
    @Query('count') count: number,
  ): Promise<Product[]> {
    return this.productService.getProducts(from, count);
  }

  @ApiOperation({ summary: 'Список рекомендуемых продуктов' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/recommended')
  recommended(
    @Query('from') from: number,
    @Query('count') count: number,
  ): Promise<Product[]> {
    return this.productService.recommended(from, count);
  }

  @ApiOperation({ summary: 'Редактирование продукты' })
  @ApiResponse({ status: 200, type: [Product] })
  @Put('/editProduct')
  editProduct(@Body() dto: EditProductDto): Promise<Product> {
    return this.productService.editProduct(dto);
  }

  @ApiOperation({ summary: 'Редактирование вариации продукта' })
  @ApiResponse({ status: 200, type: [ProductVariant] })
  @Post('/editProductVariant')
  editProductVariant(
    @Body() dto: EditProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productService.editProductVariant(dto);
  }

  @ApiOperation({ summary: 'Получить продукт по Id' })
  @ApiResponse({ status: 200, type: Product })
  @Get('/')
  getById(@Query('id') id: number): Promise<Product> {
    return this.productService.getById(id);
  }

  @ApiOperation({ summary: 'Получить продукты по категории' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/searchCategories')
  getByCategory(
    @Query('category') category: string,
    @Query('row') row: number,
  ): Promise<Product[]> {
    return this.productService.getByCategory(category, row);
  }

  @ApiOperation({ summary: 'Поиск продуктов' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/search')
  search(
    @Query('search') search: string,
    @Query('row') row: number,
  ): Promise<Product[]> {
    return this.productService.search(search, row);
  }
}
