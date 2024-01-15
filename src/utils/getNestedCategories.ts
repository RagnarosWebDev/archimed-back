import {
  Category,
  CategoryCreationAttributes,
} from '../models/category/category.model';
import { Op } from 'sequelize';

export const getNestedCategories = async (
  ids: number[],
  categoryRepository: typeof Category,
  isFather = false,
) => {
  if (ids.length == 0) {
    return [];
  }
  const categories: CategoryCreationAttributes[] = JSON.parse(
    JSON.stringify(
      await categoryRepository.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
        include: [
          ...(isFather
            ? [
                {
                  model: Category,
                  as: 'parentCategory',
                },
              ]
            : []),
          {
            model: Category,
            as: 'subCategories',
          },
        ],
      }),
    ),
  );
  for (const category of categories) {
    category.subCategories = await getNestedCategories(
      category.subCategories.map((e) => e.id),
      categoryRepository,
    );
  }

  return categories;
};

export const getParentCategory = async (
  id: number,
  categoryRepository: typeof Category,
) => {
  const category: CategoryCreationAttributes = JSON.parse(
    JSON.stringify(
      await categoryRepository.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Category,
            as: 'parentCategory',
          },
        ],
      }),
    ),
  );

  if (category.parentCategoryId != undefined) {
    category.parentCategory = await getParentCategory(
      category.parentCategoryId,
      categoryRepository,
    );
  }

  return category;
};
