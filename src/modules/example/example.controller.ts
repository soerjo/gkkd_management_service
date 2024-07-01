import { Controller, Get, Param } from '@nestjs/common';
import { ExampleService } from './example.service';

@Controller('/')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }
}
