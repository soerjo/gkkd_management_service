import { Module } from '@nestjs/common';
import { DisciplesService } from './services/disciples.service';
import { DisciplesController } from './controller/pemuridan.controller';

@Module({
  controllers: [DisciplesController],
  providers: [DisciplesService],
  exports: [DisciplesService],
})
export class DisciplesModule {}
