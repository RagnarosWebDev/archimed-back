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
import sequelize, { Includeable, Op, Optional } from 'sequelize';
import { ProductVariant } from './many/product-variant.model';
import { ValueVariant } from '../variant/value-variant.model';
import { EditProductDto } from './dto/edit-product.dto';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { EditProductVariantDto } from './dto/edit-product-variant.dto';
import { EditRecommendedDto } from './dto/edit-recommended.dto';
import { ChangeVisibleDto } from './dto/change-visible.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Variant)
    private variantRepository: typeof Variant,
    @InjectModel(ProductVariant)
    private productVariantRepository: typeof ProductVariant,
  ) {}

  async allProducts(row: number) {
    return this.productRepository.findAll({
      order: ['id'],
      offset: row * 20,
      limit: 20,
      include: this.includeFromProduct(),
    });
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
      name: dto.name,
      producer: dto.producer,
      visible: false,
      description: dto.description,
      shortProducer: dto.shortProducer,
      countryProducer: dto.countryProducer,
      count: dto.count,
      isRecommended: false,
      category: dto.category,
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

  async recommended(row: number) {
    return this.productRepository.findAll({
      where: {
        isRecommended: true,
        visible: true,
      },
      order: ['id'],
      offset: row * 20,
      limit: 20,
      include: this.includeFromProduct(),
    });
  }

  async recommendedCountPage() {
    const count = await this.productRepository.count({
      where: {
        isRecommended: true,
        visible: true,
      },
    });

    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }

  async editProduct(dto: EditProductDto) {
    const edit: Optional<Product, NullishPropertiesOf<Product>> = {};
    if (dto.count) edit.count = dto.count;
    if (dto.name) edit.name = dto.name;
    if (dto.countryProducer) edit.countryProducer = dto.countryProducer;
    if (dto.description) edit.description = dto.description;
    if (dto.producer) edit.producer = dto.producer;
    if (dto.shortProducer) edit.shortProducer = dto.shortProducer;
    if (dto.isRecommended != undefined) edit.isRecommended = dto.isRecommended;
    if (dto.category) edit.category = dto.category;
    if (dto.visible != undefined) edit.visible = dto.visible;
    await this.productRepository.update(edit, {
      where: {
        id: dto.id,
      },
    });
    return this.productRepository.findOne({
      where: {
        id: dto.id,
      },
      include: this.includeFromProduct(),
    });
  }

  async editProductVariant(dto: EditProductVariantDto) {
    const edit: Optional<
      ProductVariant,
      NullishPropertiesOf<ProductVariant>
    > = {};
    if (dto.price) edit.price = dto.price;
    if (dto.availableCount) edit.availableCount = dto.availableCount;
    if (dto.minCount) edit.minCount = dto.minCount;
    await this.productVariantRepository.update(edit, {
      where: {
        id: dto.id,
      },
    });
    return this.productVariantRepository.findOne({
      where: {
        id: dto.id,
      },
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

  async getById(id: number) {
    return this.productRepository.findOne({
      where: {
        id: id,
      },
      include: this.includeFromProduct(),
    });
  }

  async getByCategory(category: string, row: number) {
    return this.productRepository.findAll({
      where: {
        category: {
          [Op.contains]: [category],
        },
        visible: true,
      },
      include: this.includeFromProduct(),
      order: ['id'],
      offset: 20 * row,
      limit: 20,
    });
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
