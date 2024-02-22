import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { EditStatusDto } from './dto/edit-status.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Call, CallStatus } from '../../../models/call.model';
import { calculateCountPage, rowed } from '../../../utils/shared.extension';

@Injectable()
export class CallService {
  constructor(@InjectModel(Call) private callRepository: typeof Call) {}
  async create(dto: CreateCallDto) {
    return this.callRepository.create({
      ...dto,
      status: CallStatus.accepted,
    });
  }

  async all(row: number) {
    return this.callRepository.findAll(rowed(row, {}, 20));
  }

  async count() {
    const pages = await this.callRepository.count();

    return { pages: calculateCountPage(pages, 20) };
  }

  async changeStatus(dto: EditStatusDto) {
    const [rowsCount] = await this.callRepository.update(
      {
        status: dto.status,
      },
      {
        where: {
          id: dto.id,
        },
      },
    );
    if (rowsCount == 0)
      throw new BadRequestException({ message: 'Такого звонка не существует' });
    return this.callRepository.findOne({
      where: {
        id: dto.id,
      },
    });
  }
}
