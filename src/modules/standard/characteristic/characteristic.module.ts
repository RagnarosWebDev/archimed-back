import { Module } from '@nestjs/common';
import { CharacteristicController } from './characteristic.controller';
import { CharacteristicService } from './characteristic.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CharacteristicType } from '../../../models/characteristics/characteristic-type.model';
import { Characteristic } from '../../../models/characteristics/characteristic.model';

@Module({
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
  imports: [SequelizeModule.forFeature([CharacteristicType, Characteristic])],
})
export class CharacteristicModule {}
