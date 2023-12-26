import { Injectable } from '@nestjs/common';
import { CreateBlesscomnDto } from './dto/create-blesscomn.dto';
import { UpdateBlesscomnDto } from './dto/update-blesscomn.dto';

@Injectable()
export class BlesscomnService {
  create(createBlesscomnDto: CreateBlesscomnDto) {
    return 'This action adds a new blesscomn';
  }

  findAll() {
    return `This action returns all blesscomn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blesscomn`;
  }

  update(id: number, updateBlesscomnDto: UpdateBlesscomnDto) {
    return `This action updates a #${id} blesscomn`;
  }

  remove(id: number) {
    return `This action removes a #${id} blesscomn`;
  }
}
