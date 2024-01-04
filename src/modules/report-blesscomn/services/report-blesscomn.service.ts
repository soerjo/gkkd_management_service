import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';
import { BlesscomnService } from 'src/modules/blesscomn/services/blesscomn.service';

@Injectable()
export class ReportBlesscomnService {
  constructor(
    private readonly reportBlesscomnRepository: ReportBlesscomnRepository,
    private readonly blesscomnService: BlesscomnService,
  ) {}

  async create(createReportBlesscomnDto: CreateReportBlesscomnDto) {
    const isDataExist = await this.reportBlesscomnRepository.findOne({
      where: { date: createReportBlesscomnDto.date, blesscomn: { id: createReportBlesscomnDto.blesscomn_id } },
    });
    if (isDataExist) throw new BadRequestException({ message: 'data already exist!' });

    const blesscomn = await this.blesscomnService.findOne(createReportBlesscomnDto.blesscomn_id);
    if (!blesscomn) throw new BadRequestException({ message: 'Blesscomn is not found!' });
    createReportBlesscomnDto.blesscomn = blesscomn;

    const reportBlesscomn = this.reportBlesscomnRepository.create({
      ...createReportBlesscomnDto,
      total: createReportBlesscomnDto.total_female + createReportBlesscomnDto.total_male,
    });

    return this.reportBlesscomnRepository.save(reportBlesscomn);
  }

  findAll(filter: FilterDto) {
    return this.reportBlesscomnRepository.getAll(filter);
  }

  findOne(id: string) {
    return this.reportBlesscomnRepository.findOneBy({ id });
  }

  async update(id: string, updateReportBlesscomnDto: UpdateReportBlesscomnDto) {
    const pastReportBlesscomn = await this.findOne(id);
    if (!pastReportBlesscomn) throw new BadRequestException({ message: 'Blesscomn report is not found!' });

    if (updateReportBlesscomnDto.blesscomn_id) {
      const blesscomn = await this.blesscomnService.findOne(updateReportBlesscomnDto.blesscomn_id);
      if (!blesscomn) throw new BadRequestException({ message: 'Blesscomn is not found!' });
      updateReportBlesscomnDto.blesscomn = blesscomn;
    }

    await this.reportBlesscomnRepository.save({
      ...pastReportBlesscomn,
      ...updateReportBlesscomnDto,
    });

    return { id };
  }

  async remove(id: string) {
    const pastReportBlesscomn = await this.findOne(id);
    if (!pastReportBlesscomn) throw new BadRequestException({ message: 'Blesscomn report is not found!' });

    await this.reportBlesscomnRepository.softRemove(pastReportBlesscomn);

    return { id };
  }
}
