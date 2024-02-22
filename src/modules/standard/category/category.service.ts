import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Category,
  CategoryCreationAttributes,
} from '../../../models/category/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  getNestedCategories,
  getParentCategory,
} from '../../../utils/getNestedCategories';
import { Op } from 'sequelize';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryRepository: typeof Category,
  ) {}

  async getAllSymbolCodes() {
    return this.categoryRepository.findAll({
      attributes: ['symbolCode', 'id'],
      group: ['symbolCode', 'id'],
    });
  }

  async lasts(): Promise<CategoryCreationAttributes[]> {
    const categories = await this.categoryRepository.findAll({
      include: [
        {
          model: Category,
          as: 'subCategories',
        },
      ],
    });

    const promises = categories
      .filter((e) => e.subCategories.length == 0)
      .map((e) => getParentCategory(e.id, this.categoryRepository));

    await Promise.all(promises);

    const data: CategoryCreationAttributes[] = [];
    for (const promise of promises) {
      data.push(await promise);
    }

    return data;
  }

  async all() {
    const categories = await this.categoryRepository.findAll({
      include: [
        {
          model: Category,
          as: 'subCategories',
        },
      ],
    });

    const promises = categories.map((e) =>
      getParentCategory(e.id, this.categoryRepository),
    );

    await Promise.all(promises);

    const data: CategoryCreationAttributes[] = [];
    for (const promise of promises) {
      data.push(await promise);
    }

    return data;
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

    return getParentCategory(category.id, this.categoryRepository);
  }

  async update(dto: UpdateCategoryDto) {
    await this.categoryRepository.update(
      {
        ...dto,
      },
      {
        where: {
          id: dto.id,
        },
      },
    );

    return getParentCategory(dto.id, this.categoryRepository);
  }

  async getBySymbolCode(code: string) {
    const cat = await this.categoryRepository.findOne({
      where: {
        symbolCode: code,
      },
    });

    return getParentCategory(cat.id, this.categoryRepository);
  }
}
