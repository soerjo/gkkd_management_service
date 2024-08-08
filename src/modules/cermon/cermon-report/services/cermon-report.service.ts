import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CermonReportEntity } from '../entities/cermon-report.entity';
import { FilterReportDto } from '../dto/filter.dto';
import { RegionService } from '../../../region/services/region.service';
import { CermonReportRepository } from '../repository/cermon-report.repository';
import { JadwalIbadahService } from '../../cermon-schedule/services/jadwal-ibadah.service';

@Injectable()
export class ReportIbadahService {
  constructor(
    @InjectRepository(CermonReportEntity)
    private readonly reportRepository: Repository<CermonReportEntity>,
    private readonly customReportRepository: CermonReportRepository,
    private readonly cermonService: JadwalIbadahService,
    private readonly regionService: RegionService,
  ) {}

  async create(dto: CreateReportIbadahDto) {
    const cermon = await this.cermonService.findOne(dto.cermon_id);
    if (!cermon) throw new BadRequestException('cermon is not found!');

    const isExist = await this.reportRepository.findOne({ where: { cermon_id: cermon.id, date: dto.date } });
    if (isExist) throw new BadRequestException('data report already exist');

    this.reportRepository.save({
      ...dto,
      date: new Date(dto.date),
      region_id: cermon.region_id,
    });
  }

  async findAll(dto: FilterReportDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    return this.customReportRepository.getAll(dto);
  }

  findOne(id: number, region_id?: number) {
    return this.customReportRepository.getOne(id);
  }

  async update(id: number, dto: UpdateReportIbadahDto) {
    const report = await this.findOne(id);
    if (!report) throw new BadRequestException('report is not found!');

    const cermon = await this.cermonService.findOne(dto.cermon_id);
    if (!cermon) throw new BadRequestException('cermon is not found!');

    const isExist = await this.reportRepository.findOne({ where: { cermon_id: cermon.id, date: dto.date } });
    if (isExist && isExist.id !== report.id) throw new BadRequestException('data report already exist');

    this.reportRepository.save({
      ...report,
      ...dto,
      date: new Date(dto.date),
      cermon: cermon,
      region_id: cermon.region_id,
    });
  }

  async remove(id: number, region_id?: number) {
    const report = await this.findOne(id, region_id);
    if (!report) throw new BadRequestException('report is not found!');

    this.reportRepository.softRemove(report);
  }
}
