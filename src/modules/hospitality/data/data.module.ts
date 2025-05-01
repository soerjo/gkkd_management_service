import { Module } from '@nestjs/common';
import { DataService } from './services/data.service';
import { DataController } from './controllers/data.controller';

@Module({
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
