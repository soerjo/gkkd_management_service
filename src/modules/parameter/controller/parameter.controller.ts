import { Controller, Get, Param } from '@nestjs/common';
import { ParameterService } from '../services/parameter.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parameter')
@Controller('parameter')
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Get(':category')
  findOne(@Param('category') category: string) {
    return this.parameterService.findOne(category);
  }
}
