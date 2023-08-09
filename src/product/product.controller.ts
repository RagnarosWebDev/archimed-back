import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
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
import { EditRecommendedDto } from './dto/edit-recommended.dto';
import { ChangeVisibleDto } from './dto/change-visible.dto';
import * as https from 'https';

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
  addProduct(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(dto);
  }

  @ApiOperation({ summary: 'Изменить рекомендацию продукта' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/changeRecommended')
  changeRecommended(@Body() dto: EditRecommendedDto): Promise<Product> {
    return this.productService.editRecommended(dto);
  }
  @ApiConsumes('multipart/form-data')
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
        validators: [new FileTypeValidator({ fileType: /.(jpg|jpeg|png)/ })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ProductVariant> {
    const fileName = 'images/' + Date.now();
    fs.writeFileSync(fileName, file.buffer);
    return this.productService.updateImage(id, fileName);
  }

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить статик картинку' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/uploadStaticImage')
  @UseInterceptors(FileInterceptor('image'))
  async uploadStaticImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /.(jpg|jpeg|png)/ })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ fileName: string }> {
    const fileName = 'images/' + Date.now();
    fs.writeFileSync(fileName, file.buffer);
    return { fileName: fileName };
  }

  @ApiOperation({ summary: 'Загрузить статик картинку по url' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/uploadStaticImageByUrl')
  async uploadStaticImageByUrl(
    @Query('url') url: string,
  ): Promise<{ fileName: string }> {
    const fileName = 'images/' + Date.now();
    const file = fs.createWriteStream(fileName);
    https.get(url, (response) => {
      response.pipe(file);
    });
    return { fileName: fileName };
  }

  @ApiOperation({ summary: 'Изменить видимость товара' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/changeVisible')
  async changeVisible(
    @Body() dto: ChangeVisibleDto,
  ): Promise<{ success: boolean }> {
    return this.productService.changeVisible(dto);
  }

  @ApiOperation({ summary: 'Все товары вместе сс удаленными' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/allProducts')
  async allProducts(@Query('row') row: number): Promise<Product[]> {
    return this.productService.allProducts(row);
  }

  @ApiOperation({ summary: 'Список продуктов' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/list')
  list(@Query('row') row: number): Promise<Product[]> {
    return this.productService.getProducts(row);
  }

  @ApiOperation({ summary: 'Список рекомендуемых продуктов' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/recommended')
  recommended(@Query('row') row: number): Promise<Product[]> {
    return this.productService.recommended(row);
  }

  @ApiOperation({ summary: 'Редактирование продукты' })
  @ApiResponse({ status: 200, type: [Product] })
  @Post('/editProduct')
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

  @ApiOperation({ summary: 'Получить список видимых категорий' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/visibleCategories')
  visibleCategories() {
    return this.productService.allVisibleCategories();
  }

  @ApiOperation({ summary: 'Получить список всех категорий' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/allCategories')
  allCategories() {
    return this.productService.allCategories();
  }

  @ApiOperation({ summary: 'Получить кол-во страниц для категорий' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/countPagesCategory')
  countPagesCategory(@Query('category') category: string) {
    return this.productService.getByCategoryCountPage(category);
  }

  @ApiOperation({ summary: 'Получить колв-во страниц для рекмоендованных' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/countPagesRecommended')
  countPagesRecommended() {
    return this.productService.recommendedCountPage();
  }

  @ApiOperation({ summary: 'Получить колв-во страниц для продуктов и скрытых' })
  @ApiResponse({ status: 200, type: [Product] })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/allProductsCountPage')
  allProductsCountPage() {
    return this.productService.getAllProductsCountPage();
  }

  @ApiOperation({ summary: 'Получить колв-во страниц для продуктов' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/productsCountPage')
  productsCountPage() {
    return this.productService.getProductsCountPage();
  }

  @ApiOperation({ summary: 'Получить колв-во страниц для продуктов по поиску' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/searchCountPage')
  searchCountPage(@Query('search') search: string) {
    return this.productService.getSearchCountPages(search);
  }
}
