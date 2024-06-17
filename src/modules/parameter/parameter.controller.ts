import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parameter')
@Controller('parameter')
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Get(':category')
  async findAll(@Param('category') category: string) {
    return {
      message: 'success',
      data: await this.parameterService.findAll(category),
    };
  }
}
