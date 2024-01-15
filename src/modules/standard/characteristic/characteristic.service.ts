import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CharacteristicType } from '../../../models/characteristics/characteristic-type.model';
import { Characteristic } from '../../../models/characteristics/characteristic.model';
import { CreateCharacteristicsDto } from './dto/create-characteristics.dto';
import { AddCharacteristicDto } from './dto/add-characteristic.dto';
import { Op } from 'sequelize';
import { CharacteristicProduct } from '../../../models/charactertistics-product/characteristic-product.model';
import { Product } from '../../../models/product.model';

@Injectable()
export class CharacteristicService {
  constructor(
    @InjectModel(CharacteristicType)
    private characteristicTypeRepository: typeof CharacteristicType,
    @InjectModel(Characteristic)
    private characteristicRepository: typeof Characteristic,
    @InjectModel(Product)
    private productRepository: typeof Product,
  ) {}

  async all(): Promise<CharacteristicType[]> {
    return this.characteristicTypeRepository.findAll({
      include: [Characteristic],
    });
  }

  async getByIds(names: string[]) {
    return this.characteristicTypeRepository.findAll({
      where: {
        name: {
          [Op.in]: names,
        },
      },
      include: [Characteristic],
    });
  }

  async create(dto: CreateCharacteristicsDto): Promise<CharacteristicType> {
    const candidate = await this.characteristicTypeRepository.findOne({
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

    const variant = await this.characteristicTypeRepository.create({
      name: dto.name,
    });
    for (const value of dto.characteristics) {
      await this.addCharacteristic({
        characteristic: value,
        typeId: variant.id,
      });
    }
    return this.characteristicTypeRepository.findOne({
      where: {
        name: dto.name,
      },
      include: [Characteristic],
    });
  }

  async addCharacteristic(dto: AddCharacteristicDto): Promise<Characteristic> {
    const candidateType = await this.characteristicTypeRepository.findOne({
      where: {
        id: dto.typeId,
      },
    });
    if (!candidateType) {
      throw new HttpException(
        'Такой варианта не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const candidate = await this.characteristicRepository.findOne({
      where: {
        characteristicId: candidateType.id,
        name: dto.characteristic,
      },
    });

    if (candidate) {
      throw new HttpException(
        'Такой тип уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.characteristicRepository.create({
      name: dto.characteristic,
      characteristicId: dto.typeId,
    });
  }

  async getAllProductIds(ids: number[]) {
    return this.productRepository.findAll({
      where: {
        visible: true,
      },
      include: [
        {
          model: CharacteristicProduct,
          include: [
            {
              model: Characteristic,
              include: [CharacteristicType],
            },
          ],
          where: {
            id: {
              [Op.in]: ids,
            },
          },
        },
      ],
    });
  }
}
