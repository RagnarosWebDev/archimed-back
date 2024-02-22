import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CallController } from './call.controller';
import { Call } from '../../../models/call.model';

@Module({
  imports: [SequelizeModule.forFeature([Call])],
  providers: [CallService],
  controllers: [CallController],
  exports: [CallService],
})
export class CallModule {}
