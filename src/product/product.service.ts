import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Variant)
    private variantRepository: typeof Variant,
    @InjectModel(ProductVariant)
    private productVariantRepository: typeof ProductVariant,
  ) {}

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
        availableCount: productVariant.count,
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

  async getProducts(row: number) {
    return this.productRepository.findAll({
      order: ['id'],
      offset: 20 * row,
      limit: 20,
      include: this.includeFromProduct(),
    });
  }

  async getProductsCountPage() {
    const count = await this.productRepository.count({});

    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }

  async recommended(row: number) {
    return this.productRepository.findAll({
      where: {
        isRecommended: true,
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
    if (dto.isRecommended) edit.isRecommended = dto.isRecommended;
    if (dto.category) edit.category = dto.category;
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
    if (dto.count) edit.availableCount = dto.count;
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
    await this.productRepository.update(
      {
        image: file,
      },
      {
        where: {
          id: id,
        },
      },
    );
    return this.productRepository.findOne({
      where: {
        id: id,
      },
      include: this.includeFromProduct(),
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
        category: category,
      },
      include: this.includeFromProduct(),
      order: ['id'],
      offset: 20 * row,
      limit: 20,
    });
  }

  async getByCategoryCountPage(category: string) {
    const count = await this.productRepository.count({
      where: {
        category: category,
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
              [Op.like]: '%' + data + '%',
            },
          },
          {
            description: {
              [Op.like]: '%' + data + '%',
            },
          },
          {
            producer: {
              [Op.like]: '%' + data + '%',
            },
          },
          {
            countryProducer: {
              [Op.like]: '%' + data + '%',
            },
          },
        ],
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
              [Op.like]: '%' + data + '%',
            },
          },
          {
            description: {
              [Op.like]: '%' + data + '%',
            },
          },
          {
            producer: {
              [Op.like]: '%' + data + '%',
            },
          },
          {
            countryProducer: {
              [Op.like]: '%' + data + '%',
            },
          },
        ],
      },
    });
    return { pages: Math.floor(count / 20) + (count % 20 == 0 ? 0 : 1) };
  }

  async allCategories() {
    return this.productRepository.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'],
      ],
      group: ['category'],
    });
  }
}
