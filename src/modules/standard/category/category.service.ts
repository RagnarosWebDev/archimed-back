import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../../../models/category/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { getNestedCategories } from '../../../utils/getNestedCategories';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryRepository: typeof Category,
  ) {}

  async getAllSymbolCodes() {
    return this.categoryRepository.findAll({
      attributes: ['symbolCode'],
      group: ['symbolCode'],
    });
  }

  async getByIds(names: string[], isFather = false) {
    const cat = await this.categoryRepository.findAll({
      where: {
        name: {
          [Op.in]: names,
        },
      },
    });
    return await getNestedCategories(
      cat.map((e) => e.id),
      this.categoryRepository,
      isFather,
    );
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentCategoryId != undefined && dto.parentCategoryId != null) {
      const parent = await this.categoryRepository.findOne({
        where: {
          id: dto.parentCategoryId,
        },
      });

      if (!parent) {
        throw new BadRequestException({
          message: 'Такой родительской категории нет',
        });
      }
    }

    const category = await this.categoryRepository.create({
      ...dto,
    });

    return this.categoryRepository.findOne({
      where: {
        id: category.id,
      },
      include: {
        all: true,
      },
    });
  }

  async getBySymbolCode(code: string) {
    return this.categoryRepository.findOne({
      where: {
        symbolCode: code,
      },
    });
  }
}
