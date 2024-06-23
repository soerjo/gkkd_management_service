import { Test, TestingModule } from '@nestjs/testing';
import { BooksLevelService } from './books-level.service';

describe('BooksLevelService', () => {
  let service: BooksLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksLevelService],
    }).compile();

    service = module.get<BooksLevelService>(BooksLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
