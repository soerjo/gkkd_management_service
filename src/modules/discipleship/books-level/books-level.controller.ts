import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksLevelService } from './books-level.service';
import { CreateBooksLevelDto } from './dto/create-books-level.dto';
import { UpdateBooksLevelDto } from './dto/update-books-level.dto';

@Controller('books-level')
export class BooksLevelController {
  constructor(private readonly booksLevelService: BooksLevelService) {}

  @Post()
  create(@Body() createBooksLevelDto: CreateBooksLevelDto) {
    return this.booksLevelService.create(createBooksLevelDto);
  }

  @Get()
  findAll() {
    return this.booksLevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksLevelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBooksLevelDto: UpdateBooksLevelDto) {
    return this.booksLevelService.update(+id, updateBooksLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksLevelService.remove(+id);
  }
}
