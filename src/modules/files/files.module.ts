import { Module } from '@nestjs/common';
import { FilesController } from './controller/files.controller';
import { FilesService } from './services/files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
