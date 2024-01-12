import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../../models/product.model';
import { CreateProductDto, CreateVariantsDto } from './dto/create-product.dto';
import { CharacteristicType } from '../../../models/characteristics/characteristic-type.model';
import { Op } from 'sequelize';
import { CharacteristicProduct } from '../../../models/charactertistics-product/characteristic-product.model';
import { Characteristic } from '../../../models/characteristics/characteristic.model';
import {
  calculateCountPage,
  destroyFields,
  excludeFields,
  rowed,
} from '../../../utils/shared.extension';
import {
  FilterProductDto,
  FilterUnRowedProductDto,
} from './dto/filter-product.dto';
import { CreateSubCategoryDto } from '../category/dto/create-sub-category.dto';
import { SubCategory } from '../../../models/category/sub-category.model';
import { RecommendedDto } from './dto/recommended.dto';
import { UploadImageDto } from './dto/upload-image.dto';

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
  {
    model: SubCategory,
    through: { attributes: [] },
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
    @InjectModel(SubCategory)
    private subCategoryRepository: typeof SubCategory,
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
      await this.tryGetOrCreateCategories(dto.categories),
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

    return this.productRepository.findOne({
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
            ...excludeFields(dto, FilterProductDto, [
              'row',
              'countItems',
              'category',
            ]),
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
              model: SubCategory,
              through: { attributes: [] },
              where: dto.category
                ? {
                    [Op.or]: {
                      name: dto.category,
                      categoryName: dto.category,
                    },
                  }
                : {},
            },
          ],
        },
        dto.countItems,
      ),
    );
  }

  async filterItems() {
    const producer = await this.productRepository.findAll({
      group: ['producer'],
      attributes: ['producer'],
    });

    const country = await this.productRepository.findAll({
      group: ['countryProducer'],
      attributes: ['countryProducer'],
    });

    return {
      producer: producer.map((e) => e.producer),
      country: country.map((e) => e.countryProducer),
    };
  }

  async countAll(dto: FilterUnRowedProductDto) {
    const pages = await this.productRepository.count({
      where: {
        ...excludeFields(dto, FilterProductDto, ['countItems', 'category']),
      },
      include: [
        {
          model: SubCategory,
          where: dto.category
            ? {
                name: dto.category,
              }
            : {},
        },
      ],
    });

    return { pages: calculateCountPage(pages, dto.countItems) };
  }

  async getBySymbolCode(symbolCode: string) {
    return this.productRepository.findOne({
      where: {
        symbolCode: symbolCode,
      },
      include: productsIncluding,
    });
  }

  async tryGetOrCreateCategories(subCategories: CreateSubCategoryDto[]) {
    const ids: number[] = [];
    for (const category of subCategories) {
      const categoryDes = destroyFields(category, CreateSubCategoryDto);
      let cat = await this.subCategoryRepository.findOne({
        where: {
          ...categoryDes,
        },
      });

      if (!cat) {
        cat = await this.subCategoryRepository.create({
          ...categoryDes,
        });
      }

      ids.push(cat.id);
    }
    return ids;
  }

  async groupByCategories(
    dto: RecommendedDto,
  ): Promise<Record<string, Product[]>> {
    const products: Record<string, Product[]> = {};

    const categories = await this.subCategoryRepository.findAll(
      rowed(0, {}, 10),
    );

    for (const category of categories) {
      products[`${category.name}::${category.categoryName}`] =
        await this.productRepository.findAll<Product>(
          rowed(
            0,
            {
              where: {
                visible: true,
              },
              include: productsIncluding,
            },
            dto.pageCount,
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
