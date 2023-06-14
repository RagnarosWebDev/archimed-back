import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Variant } from './variant.model';
import { ValueVariant } from './value-variant.model';
import { CreateVariantDto } from './dto/create-variant.dto';
import { AddValueVariantDto } from './dto/add-value-variant.dto';

@Injectable()
export class VariantService {
  constructor(
    @InjectModel(Variant) private variantRepository: typeof Variant,
    @InjectModel(ValueVariant)
    private valueVariantRepository: typeof ValueVariant,
  ) {}

  async addVariant(dto: CreateVariantDto): Promise<Variant> {
    const candidate = await this.variantRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (candidate) {
      throw new HttpException(
        'Такой вариант уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const variant = await this.variantRepository.create({
      name: dto.name,
    });
    for (const value of dto.variants) {
      await this.valueVariantRepository.create({
        variantId: variant.id,
        variantValue: value,
      });
    }
    return this.variantRepository.findOne({
      where: {
        name: dto.name,
      },
      include: [ValueVariant],
    });
  }

  async all(): Promise<Variant[]> {
    return this.variantRepository.findAll({
      include: [ValueVariant],
    });
  }

  async addValueVariant(dto: AddValueVariantDto): Promise<ValueVariant> {
    const candidate = await this.variantRepository.findOne({
      where: {
        id: dto.variantId,
      },
    });
    if (!candidate) {
      throw new HttpException(
        'Такой варианта не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      await this.valueVariantRepository.findOne({
        where: {
          variantValue: dto.variantName,
        },
      })
    ) {
      throw new HttpException(
        'Такой тип уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.valueVariantRepository.create({
      variantValue: dto.variantName,
      variantId: dto.variantId,
    });
  }
}
