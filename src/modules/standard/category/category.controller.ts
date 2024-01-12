import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  SubCategory,
  SubCategoryCreationAttributes,
} from '../../../models/category/sub-category.model';
import { CategoriesByIdDto } from './dto/categories-by-id.dto';

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Получить категории по id' })
  @ApiResponse({ status: 200, type: [SubCategoryCreationAttributes] })
  @Post('/list')
  create(@Body() dto: CategoriesByIdDto): Promise<SubCategory[]> {
    return this.categoryService.getByIds(dto.categoriesId);
  }
}
