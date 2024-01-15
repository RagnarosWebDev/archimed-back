import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationProductAttributes,
  Product,
} from '../../../models/product.model';
import { CreateProductDto, CreateVariantsDto } from './dto/create-product.dto';
import { CharacteristicType } from '../../../models/characteristics/characteristic-type.model';
import { Op } from 'sequelize';
import { CharacteristicProduct } from '../../../models/charactertistics-product/characteristic-product.model';
import { Characteristic } from '../../../models/characteristics/characteristic.model';
import { calculateCountPage, rowed } from '../../../utils/shared.extension';
import {
  FilterProductDto,
  FilterUnRowedProductDto,
} from './dto/filter-product.dto';
import {
  Category,
  CategoryCreationAttributes,
} from '../../../models/category/category.model';
import { RecommendedDto } from './dto/recommended.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { getParentCategory } from '../../../utils/getNestedCategories';

const productsIncluding = [
  {
    model: CharacteristicProduct,
    include: [
      {
        model: Characteristic,
        through: { attributes: [] },
        include: [CharacteristicType],
        attributes: {
          exclude: ['variantId'],
        },
      },
    ],
    attributes: {
      exclude: ['productId'],
    },
  },
];
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(CharacteristicType)
    private characteristicTypeRepository: typeof CharacteristicType,
    @InjectModel(CharacteristicProduct)
    private characteristicProductRepository: typeof CharacteristicProduct,
    @InjectModel(Category)
    private categoryRepository: typeof Category,
  ) {}
  async createProduct(dto: CreateProductDto): Promise<Product> {
    const candidate = await this.productRepository.findOne({
      where: {
        [Op.or]: [
          {
            name: dto.name,
          },
          {
            symbolCode: dto.symbolCode,
          },
        ],
      },
    });
    if (candidate) {
      throw new HttpException(
        'Товар с таким именем уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const variants: CharacteristicType[] =
      await this.characteristicTypeRepository.findAll({
        where: {
          name: {
            [Op.in]: dto.variants,
          },
        },
        include: [Characteristic],
      });

    if (variants.length != dto.variants.length) {
      throw new BadRequestException({
        message: 'Такого варианта не существует',
      });
    }

    const categories = await this.categoryRepository.findAll({
      where: {
        name: {
          [Op.in]: dto.categories,
        },
      },
    });

    if (categories.length != dto.categories.length) {
      throw new BadRequestException({
        message: 'Таких категорий не существует',
      });
    }

    const productVariantsCreated = variants
      .map((u) => u.characteristics)
      .flat();

    for (const productCharacteristicDto of dto.productVariants) {
      if (
        productCharacteristicDto.variants.filter(
          (e) => !productVariantsCreated.find((e1) => e == e1.name),
        ).length > 0
      ) {
        throw new BadRequestException({
          message: 'Неправильное значение варианта',
        });
      }
    }

    const product: Product = await this.productRepository.create({
      ...dto,
    });
    await product.$set(
      'categories',
      categories.map((e) => e.id),
    );

    for (const productCharacteristicDto of dto.productVariants) {
      const current = await this.createProductWithCharacteristics(
        productCharacteristicDto,
        product.id,
      );
      await current.$set(
        'characteristics',
        productVariantsCreated
          .filter((u) => productCharacteristicDto.variants.includes(u.name))
          .map((u) => u.id),
      );
    }

    return await this.productRepository.findOne({
      where: {
        id: product.id,
      },
      include: productsIncluding,
    });
  }
  async createProductWithCharacteristics(
    dto: CreateVariantsDto,
    productId: number,
  ) {
    return await this.characteristicProductRepository.create({
      ...dto,
      productId,
    });
  }

  async getAll(dto: FilterProductDto) {
    return await this.productRepository.findAll(
      rowed(
        dto.row,
        {
          where: {
            visible: true,
            ...(dto.producer
              ? {
                  shortProducer: dto.producer,
                }
              : {}),
            ...(dto.country
              ? {
                  countryProducer: dto.country,
                }
              : {}),
            ...(dto.query
              ? {
                  [Op.or]: [
                    {
                      name: {
                        [Op.iLike]: `%${dto.query}%`,
                      },
                    },
                    {
                      description: {
                        [Op.iLike]: `%${dto.query}%`,
                      },
                    },
                  ],
                }
              : {}),
          },
          include: [
            {
              model: CharacteristicProduct,
              include: [
                {
                  model: Characteristic,
                  through: { attributes: [] },
                  include: [CharacteristicType],
                  attributes: {
                    exclude: ['variantId'],
                  },
                },
              ],
              attributes: {
                exclude: ['productId'],
              },
            },
            {
              model: Category,
              through: { attributes: [] },
              where: dto.category
                ? {
                    [Op.or]: {
                      symbolCode: dto.category,
                    },
                  }
                : {},
            },
          ],
        },
        dto.itemsCount,
      ),
    );
  }

  async filterItems() {
    const producer = await this.productRepository.findAll({
      group: ['shortProducer'],
      attributes: ['shortProducer'],
    });

    const country = await this.productRepository.findAll({
      group: ['countryProducer'],
      attributes: ['countryProducer'],
    });

    return {
      producer: producer.map((e) => e.shortProducer),
      country: country.map((e) => e.countryProducer),
    };
  }

  async getAllSymbolCodes() {
    return this.productRepository.findAll({
      attributes: ['symbolCode'],
      group: ['symbolCode'],
    });
  }

  async countAll(dto: FilterUnRowedProductDto) {
    const pages = await this.productRepository.count({
      where: {
        visible: true,
        ...(dto.producer
          ? {
              shortProducer: dto.producer,
            }
          : {}),
        ...(dto.country
          ? {
              countryProducer: dto.country,
            }
          : {}),
        ...(dto.query
          ? {
              [Op.or]: [
                {
                  name: {
                    [Op.iLike]: `%${dto.query}%`,
                  },
                },
                {
                  description: {
                    [Op.iLike]: `%${dto.query}%`,
                  },
                },
              ],
            }
          : {}),
      },
      include: [
        {
          model: Category,
          where: dto.category
            ? {
                symbolCode: dto.category,
              }
            : {},
        },
      ],
    });

    return { pages: calculateCountPage(pages, dto.itemsCount) };
  }

  async getBySymbolCode(
    symbolCode: string,
  ): Promise<
    CreationProductAttributes & { categories: CategoryCreationAttributes[] }
  > {
    const a = await this.productRepository.findOne({
      where: {
        symbolCode: symbolCode,
        visible: true,
      },
      include: [
        ...productsIncluding,
        {
          model: Category,
        },
      ],
    });
    const categories: CategoryCreationAttributes[] = [];
    for (const i of a?.categories ?? []) {
      categories.push(await getParentCategory(i.id, this.categoryRepository));
    }

    return {
      ...JSON.parse(JSON.stringify(a)),
      categories: categories,
    };
  }

  async groupByCategories(
    dto: RecommendedDto,
  ): Promise<Record<string, Product[]>> {
    const products: Record<string, Product[]> = {};

    const categories = await this.categoryRepository.findAll<Category>(
      rowed(
        0,
        {
          where: {},
          include: [],
        },
        10,
      ),
    );

    for (const category of categories) {
      products[`${category.name}`] =
        await this.productRepository.findAll<Product>(
          rowed(
            0,
            {
              where: {
                visible: true,
                ...(dto.producer
                  ? {
                      shortProducer: dto.producer,
                    }
                  : {}),
                ...(dto.country
                  ? {
                      countryProducer: dto.country,
                    }
                  : {}),
              },
              include: [
                ...productsIncluding,
                {
                  model: Category,
                  where: {
                    name: category.name,
                  },
                },
              ],
            },
            dto.itemsCount,
          ),
        );
    }

    return products;
  }

  async updateImage(dto: UploadImageDto) {
    const [count] = await this.characteristicProductRepository.update(
      {
        image: dto.image.filename,
      },
      {
        where: {
          id: dto.characteristicProductId,
        },
      },
    );

    if (count == 0) {
      throw new BadRequestException({
        message: 'Поля с таким id нет',
      });
    }

    return await this.characteristicProductRepository.findOne({
      where: {
        id: dto.characteristicProductId,
      },
    });
  }
}
