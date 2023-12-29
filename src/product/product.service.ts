import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Variant } from '../variant/variant.model';
import sequelize, { Includeable, Op } from 'sequelize';
import { ProductVariant } from './many/product-variant.model';
import { ValueVariant } from '../variant/value-variant.model';
import { EditProductDto } from './dto/edit-product.dto';
import { EditRecommendedDto } from './dto/edit-recommended.dto';
import { ChangeVisibleDto } from './dto/change-visible.dto';
import {
  calculateCountPage,
  filterNullableOrUndefined,
  getFields,
  rowed,
} from '../utils/shared.extension';
import { EditProductVariantDto } from './dto/edit-product-variant.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductService {
  includeFromProduct(): Includeable[] {
    return [
      {
        model: ProductVariant,
        include: [
          {
            model: ValueVariant,
            through: { attributes: [] },
            attributes: {
              exclude: ['variantId'],
            },
          },
        ],
        attributes: {
          exclude: ['productId'],
        },
      },
      { model: Variant, through: { attributes: [] } },
    ];
  }

  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Variant)
    private variantRepository: typeof Variant,
    @InjectModel(ProductVariant)
    private productVariantRepository: typeof ProductVariant,
  ) {}

  async allProducts(row: number) {
    return this.productRepository.findAll(
      rowed(row, {
        include: this.includeFromProduct(),
      }),
    );
  }
  async changeVisible(dto: ChangeVisibleDto) {
    const [count] = await this.productRepository.update(
      {
        visible: dto.visible,
      },
      {
        where: {
          id: dto.id,
        },
      },
    );

    if (count == 0) {
      throw new BadRequestException({
        message: 'такого товара не сущетсвует',
      });
    }
    return { success: true };
  }
  async editRecommended(dto: EditRecommendedDto) {
    await this.productRepository.update(
      {
        isRecommended: dto.isRecommended,
      },
      {
        where: {
          id: dto.id,
        },
      },
    );
    return this.productRepository.findOne({
      where: {
        id: dto.id,
      },
    });
  }

  async editProductVariant(dto: EditProductVariantDto) {
    await this.productVariantRepository.update(
      filterNullableOrUndefined(
        getFields(['price', 'availableCount', 'minCount'], dto),
      ),
      {
        where: {
          id: dto.id,
        },
      },
    );
    return this.productVariantRepository.findOne({
      where: {
        id: dto.id,
      },
    });
  }
  async createProduct(dto: CreateProductDto): Promise<Product> {
    if (
      await this.productRepository.findOne({
        where: {
          name: dto.name,
        },
      })
    ) {
      throw new HttpException(
        'Товар с таким именем уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const variants: Variant[] = await this.variantRepository.findAll({
      where: {
        name: {
          [Op.in]: dto.variants,
        },
      },
      include: [ValueVariant],
    });

    const productVariantsCreated = variants.map((u) => u.values).flat();

    const product: Product = await this.productRepository.create({
      ...getFields(
        [
          'name',
          'producer',
          'description',
          'shortProducer',
          'countryProducer',
          'count',
          'visible',
          'isRecommended',
          'category',
          'symbolCode',
        ],
        dto,
      ),
      visible: false,
      isRecommended: false,
    });

    for (const productVariant of dto.productVariants) {
      const current = await this.productVariantRepository.create({
        productId: product.id,
        price: productVariant.price,
        secondPrice: productVariant.secondPrice,
        thirdPrice: productVariant.thirdPrice,
        fourthPrice: productVariant.fourthPrice,
        minCount: productVariant.minCount,
        availableCount: productVariant.availableCount,
      });
      await current.$set(
        'valueVariants',
        productVariantsCreated
          .filter((u) => productVariant.variants.includes(u.variantValue))
          .map((u) => u.id),
      );
    }

    await product.$set(
      'variants',
      variants.map((u) => u.id),
    );

    return this.productRepository.findOne({
      where: {
        id: product.id,
      },
      include: this.includeFromProduct(),
    });
  }

  async getAllProductsCountPage() {
    const count = await this.productRepository.count({});

    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }

  async getProducts(row: number) {
    return this.productRepository.findAll({
      where: {
        visible: true,
      },
      order: ['id'],
      offset: 20 * row,
      limit: 20,
      include: this.includeFromProduct(),
    });
  }

  async getProductsCountPage() {
    const count = await this.productRepository.count({
      where: {
        visible: true,
      },
    });

    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }

  async recommended(row: number, index: number) {
    return this.productRepository.findAll({
      where: {
        isRecommended: true,
        visible: true,
      },
      order: ['id'],
      offset: row * index,
      limit: index,
      include: this.includeFromProduct(),
    });
  }

  async recommendedCountPage(index: number) {
    const count = await this.productRepository.count({
      where: {
        isRecommended: true,
        visible: true,
      },
    });

    console.log(count);

    return { pages: calculateCountPage(count, index) };
  }

  async editProduct(dto: EditProductDto) {
    await this.productRepository.update(
      {
        ...filterNullableOrUndefined(
          getFields(
            [
              'count',
              'name',
              'countryProducer',
              'description',
              'producer',
              'shortProducer',
              'isRecommended',
              'category',
              'visible',
            ],
            dto,
          ),
        ),
      },
      {
        where: {
          id: dto.id,
        },
      },
    );
    return this.productRepository.findOne({
      where: {
        id: dto.id,
      },
      include: this.includeFromProduct(),
    });
  }

  async updateImage(id: number, file: string) {
    await this.productVariantRepository.update(
      {
        image: file,
      },
      {
        where: {
          id: id,
        },
      },
    );
    return this.productVariantRepository.findOne({
      where: {
        id: id,
      },
      include: [ValueVariant],
    });
  }

  async getBySymbolCode(symbolCode: string) {
    return this.productRepository.findOne({
      where: {
        symbolCode: symbolCode,
      },
      include: this.includeFromProduct(),
    });
  }

  async baseDatas() {
    const producers = await this.productRepository.findAll({
      attributes: [
        [sequelize.fn('distinct', sequelize.col('producer')), 'producer'],
      ],
      group: ['producer'],
      raw: true,
    });
    const countries = await this.productRepository.findAll({
      attributes: [
        [
          sequelize.fn('distinct', sequelize.col('countryProducer')),
          'countryProducer',
        ],
      ],
      group: ['countryProducer'],
      raw: true,
    });
    return {
      producer: producers.map((e) => e.producer),
      country: countries.map((e) => e.countryProducer),
    };
  }

  async getByCategory(dto: FilterProductDto) {
    const categories = await this.productRepository.findAll({
      attributes: [
        [
          sequelize.fn('distinct unnest', sequelize.col('category')),
          'category',
        ],
      ],
      group: ['category'],
      raw: true,
    });

    const mapped: Record<string, Product[]> = {};

    for (const m of categories) {
      const cat = m.category as unknown as string;
      mapped[cat] = await this.productRepository.findAll(
        rowed(
          0,
          {
            where: {
              category: {
                [Op.contains]: [cat],
              },
              producer: {
                [Op.iLike]: `%${dto.producer ?? ''}%`,
              },
              countryProducer: {
                [Op.iLike]: `%${dto.country ?? ''}%`,
              },
            },
            include: [ProductVariant],
          },
          5,
        ),
      );
    }

    return mapped;
  }

  async getByCategoryCountPage(category: string) {
    const count: number = await this.productRepository.count({
      where: {
        category: { [Op.contains]: [category] },
        visible: true,
      },
    });

    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }

  async search(data: string, row: number) {
    return this.productRepository.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: '%' + data + '%',
            },
          },
          {
            description: {
              [Op.iLike]: '%' + data + '%',
            },
          },
          {
            producer: {
              [Op.iLike]: '%' + data + '%',
            },
          },
          {
            countryProducer: {
              [Op.iLike]: '%' + data + '%',
            },
          },
        ],
        visible: true,
      },
      include: this.includeFromProduct(),
      order: ['id'],
      offset: 20 * row,
      limit: 20,
    });
  }
  async getSearchCountPages(data: string) {
    const count = await this.productRepository.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: '%' + data + '%',
            },
          },
          {
            description: {
              [Op.iLike]: '%' + data + '%',
            },
          },
          {
            producer: {
              [Op.iLike]: '%' + data + '%',
            },
          },
          {
            countryProducer: {
              [Op.iLike]: '%' + data + '%',
            },
          },
        ],
        visible: true,
      },
    });
    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }
  async allVisibleCategories() {
    return this.productRepository.findAll({
      where: {
        visible: true,
      },
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'],
      ],
      group: ['category'],
    });
  }
  async allCategories() {
    const [[result]] = await this.productRepository.sequelize.query(
      'SELECT array_agg(category) AS category FROM (SELECT distinct(unnest(category)) AS category FROM product) subquery;',
    );
    return (result as { category: string[] }).category;
  }
}
