import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Category,
  CategoryCreationAttributes,
} from '../../../models/category/category.model';
import { CategoriesByNamesDto } from './dto/categories-by-names.dto';
import { TypedBody } from '../../../utils/auth-data.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesGuard } from '../../../utils/roles.guard';
import { Role } from '../../../models/user/role.model';
import { Roles } from '../../../utils/roles-auth.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  @ApiOperation({ summary: 'Получить последние категории' })
  @ApiResponse({ status: 200, type: [CategoryCreationAttributes] })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/lasts')
  lasts(): Promise<CategoryCreationAttributes[]> {
    return this.categoryService.lasts();
  }

  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, type: [CategoryCreationAttributes] })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/all')
  all(): Promise<CategoryCreationAttributes[]> {
    return this.categoryService.all();
  }

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({ status: 200, type: CategoryCreationAttributes })
  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateCategoryDto })
  create(@TypedBody(CreateCategoryDto) category: CreateCategoryDto) {
    return this.categoryService.create(category);
  }

  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiResponse({ status: 200, type: CategoryCreationAttributes })
  @Post('/update')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: UpdateCategoryDto })
  update(@TypedBody(UpdateCategoryDto) category: UpdateCategoryDto) {
    return this.categoryService.update(category);
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
  getBySymbolCode(
    @Query('symbolCode') symbolCode: string,
  ): Promise<CategoryCreationAttributes> {
    return this.categoryService.getBySymbolCode(symbolCode);
  }
}
