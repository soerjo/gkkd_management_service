import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParameterEntity } from './entities/parameter.entity';

@Injectable()
export class ParameterService {
  constructor(
    @InjectRepository(ParameterEntity)
    private parameterRepo: Repository<ParameterEntity>,
  ) {}

  findAll(category: string) {
    return this.parameterRepo.find({ where: { category } });
  }
}
