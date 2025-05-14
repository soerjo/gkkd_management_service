import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { HospitalityReportRepository } from '../repositories/hospitality-report.repository';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { JadwalIbadahService } from '../../../../modules/cermon/cermon-schedule/services/jadwal-ibadah.service';
import { HospitalityDataService } from '../../data/services/data.service';
import { FindAllReportDto } from '../dto/find-all-report.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly hospitalityReportRepository: HospitalityReportRepository,
    private readonly hospitalityDataService: HospitalityDataService,
    private readonly cermonService: JadwalIbadahService,
  ) {}

  async create(createReportDto: CreateReportDto, jwtPayload: IJwtPayload) {
    const hospitalityData = await this.hospitalityDataService.findOne(createReportDto.hospitality_data_id);
    if (!hospitalityData) throw new BadRequestException('hospitality data not found');
    
    const cermon = await this.cermonService.getOne(createReportDto.sunday_service_id, jwtPayload.region_id);
    if (!cermon) throw new BadRequestException('cermon not found');

    const createRepor = this.hospitalityReportRepository.create({
      hospitality_data_id: createReportDto.hospitality_data_id,
      sunday_service_id: createReportDto.sunday_service_id,
      date: createReportDto.date,
      region_id: jwtPayload.region.id,
      created_by: jwtPayload.id,
    })

    return this.hospitalityReportRepository.save(createRepor);
  }

  findAll(dto: FindAllReportDto, jwtPayload: IJwtPayload) {
    return this.hospitalityReportRepository.getAll({...dto, region_id: jwtPayload.region.id});
  }

  getSundayService(dto: FindAllReportDto, jwtPayload: IJwtPayload) {
    return this.hospitalityReportRepository.getSumPerSegment({...dto, region_id: jwtPayload.region.id});
  }

  async remove(id: number, jwtPayload: IJwtPayload) {
    const report = await this.hospitalityReportRepository.findOne({
      where: { id },
    });
    if (!report) throw new BadRequestException('report not found');

    return this.hospitalityReportRepository.remove(report);
  }
}
