import { Injectable } from '@nestjs/common';
import { CreateJadwalIbadahDto } from '../dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from '../dto/update-jadwal-ibadah.dto';

@Injectable()
export class JadwalIbadahService {
  create(createJadwalIbadahDto: CreateJadwalIbadahDto) {
    return 'This action adds a new jadwalIbadah';
  }

  findAll() {
    return `This action returns all jadwalIbadah`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jadwalIbadah`;
  }

  update(id: number, updateJadwalIbadahDto: UpdateJadwalIbadahDto) {
    return `This action updates a #${id} jadwalIbadah`;
  }

  remove(id: number) {
    return `This action removes a #${id} jadwalIbadah`;
  }
}
