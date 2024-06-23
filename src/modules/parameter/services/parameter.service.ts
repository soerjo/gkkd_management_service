import { Injectable } from '@nestjs/common';
import { ParameterEntity } from '../entities/parameter.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParameterService {
  constructor(
    @InjectRepository(ParameterEntity)
    private readonly paramRepo: Repository<ParameterEntity>,
  ) {}

  findOne(category: string) {
    return this.paramRepo.find({ where: { category } });
  }
}
