import { Injectable } from '@nestjs/common';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';

@Injectable()
export class ReportIbadahService {
  create(createReportIbadahDto: CreateReportIbadahDto) {
    return 'This action adds a new reportIbadah';
  }

  findAll() {
    return `This action returns all reportIbadah`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportIbadah`;
  }

  update(id: number, updateReportIbadahDto: UpdateReportIbadahDto) {
    return `This action updates a #${id} reportIbadah`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportIbadah`;
  }
}
