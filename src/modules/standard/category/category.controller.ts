import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Category,
  CategoryCreationAttributes,
} from '../../../models/category/category.model';
import { CategoriesByNamesDto } from './dto/categories-by-names.dto';
import { TypedBody } from '../../../utils/auth-data.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Получить категории по id' })
  @ApiResponse({ status: 200, type: [CategoryCreationAttributes] })
  @Post('/list')
  @ApiBody({ type: CategoriesByNamesDto })
  list(
    @TypedBody(CategoriesByNamesDto) dto: CategoriesByNamesDto,
  ): Promise<CategoryCreationAttributes[]> {
    return this.categoryService.getByIds(dto.categoriesId, true);
  }

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({ status: 200, type: CategoryCreationAttributes })
  @Post('/create')
  @ApiBody({ type: CreateCategoryDto })
  create(@TypedBody(CreateCategoryDto) category: CreateCategoryDto) {
    return this.categoryService.create(category);
  }

  @ApiOperation({ summary: 'Получить все symbolCode' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get('/getAllSymbolCodes')
  getAllSymbolCodes(): Promise<Category[]> {
    return this.categoryService.getAllSymbolCodes();
  }

  @ApiOperation({ summary: 'Получить категорию по symbol code' })
  @ApiResponse({ status: 200, type: Category })
  @Get('/getBySymbolCode')
  getBySymbolCode(@Query('symbolCode') symbolCode: string): Promise<Category> {
    return this.categoryService.getBySymbolCode(symbolCode);
  }
}
