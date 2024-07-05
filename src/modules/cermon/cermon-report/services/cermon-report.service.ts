import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CermonReportEntity } from '../entities/cermon-report.entity';
import { FilterReportDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';
import { CermonReportRepository } from '../repository/cermon-report.repository';
import { JadwalIbadahService } from '../../cermon-schedule/services/jadwal-ibadah.service';

@Injectable()
export class ReportIbadahService {
  constructor(
    @InjectRepository(CermonReportEntity)
    private readonly reportRepository: Repository<CermonReportEntity>,
    private readonly customReportRepository: CermonReportRepository,
    private readonly cermonService: JadwalIbadahService,
  ) {}

  async create(dto: CreateReportIbadahDto) {
    const cermon = await this.cermonService.findOne(dto.cermon_schedule_id, dto.region_id);
    if (!cermon) throw new BadRequestException('cermon is not found!');

    const isExist = await this.reportRepository.findOne({ where: { cermon_schedule_id: cermon.id, date: dto.date } });
    if (isExist) throw new BadRequestException('data report already exist');

    this.reportRepository.save({ ...dto, region_id: cermon.region_id });
  }

  findAll(dto: FilterReportDto) {
    return this.customReportRepository.getAll(dto);
  }

  findOne(id: number, region_id?: number) {
    return this.reportRepository.findOne({ where: { id, region_id } });
  }

  async update(id: number, dto: UpdateReportIbadahDto) {
    const report = await this.findOne(id, dto.region_id);
    if (!report) throw new BadRequestException('report is not found!');

    this.reportRepository.save({ ...report, ...dto });
  }

  async remove(id: number, region_id: number) {
    const report = await this.findOne(id, region_id);
    if (!report) throw new BadRequestException('report is not found!');

    this.reportRepository.softRemove(report);
  }
}
