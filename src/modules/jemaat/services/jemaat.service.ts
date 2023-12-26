import { Injectable } from '@nestjs/common';
import { CreateJemaatDto } from '../dto/create-jemaat.dto';
import { UpdateJemaatDto } from '../dto/update-jemaat.dto';

@Injectable()
export class JemaatService {
  create(createJemaatDto: CreateJemaatDto) {
    return 'This action adds a new jemaat';
  }

  findAll() {
    return `This action returns all jemaat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jemaat`;
  }

  update(id: number, updateJemaatDto: UpdateJemaatDto) {
    return `This action updates a #${id} jemaat`;
  }

  remove(id: number) {
    return `This action removes a #${id} jemaat`;
  }
}
