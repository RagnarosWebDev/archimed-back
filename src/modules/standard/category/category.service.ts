import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubCategory } from '../../../models/category/sub-category.model';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(SubCategory)
    private subCategoryRepository: typeof SubCategory,
  ) {}

  async getByIds(ids: number[]) {
    return this.subCategoryRepository.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }
}
