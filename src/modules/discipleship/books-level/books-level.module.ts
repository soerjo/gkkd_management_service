import { Module } from '@nestjs/common';
import { BooksLevelService } from './books-level.service';
import { BooksLevelController } from './books-level.controller';

@Module({
  controllers: [BooksLevelController],
  providers: [BooksLevelService],
})
export class BooksLevelModule {}
