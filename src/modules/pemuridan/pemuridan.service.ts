import { Injectable } from '@nestjs/common';
import { CreatePemuridanDto } from './dto/create-pemuridan.dto';
import { UpdatePemuridanDto } from './dto/update-pemuridan.dto';

@Injectable()
export class PemuridanService {
  create(createPemuridanDto: CreatePemuridanDto) {
    return 'This action adds a new pemuridan';
  }

  findAll() {
    return `This action returns all pemuridan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pemuridan`;
  }

  update(id: number, updatePemuridanDto: UpdatePemuridanDto) {
    return `This action updates a #${id} pemuridan`;
  }

  remove(id: number) {
    return `This action removes a #${id} pemuridan`;
  }
}
