import { Injectable } from '@nestjs/common';
import { CreateBooksLevelDto } from './dto/create-books-level.dto';
import { UpdateBooksLevelDto } from './dto/update-books-level.dto';

@Injectable()
export class BooksLevelService {
  create(createBooksLevelDto: CreateBooksLevelDto) {
    return 'This action adds a new booksLevel';
  }

  findAll() {
    return `This action returns all booksLevel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booksLevel`;
  }

  update(id: number, updateBooksLevelDto: UpdateBooksLevelDto) {
    return `This action updates a #${id} booksLevel`;
  }

  remove(id: number) {
    return `This action removes a #${id} booksLevel`;
  }
}
