import { Test, TestingModule } from '@nestjs/testing';
import { BooksLevelController } from './books-level.controller';
import { BooksLevelService } from './books-level.service';

describe('BooksLevelController', () => {
  let controller: BooksLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksLevelController],
      providers: [BooksLevelService],
    }).compile();

    controller = module.get<BooksLevelController>(BooksLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
