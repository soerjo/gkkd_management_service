import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReportIbadahDto } from '../dto/create-report-ibadah.dto';
import { UpdateReportIbadahDto } from '../dto/update-report-ibadah.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CermonReportEntity } from '../entities/cermon-report.entity';
import { FilterReportDto } from '../dto/filter.dto';
import { RegionService } from '../../../region/services/region.service';
import { CermonReportRepository } from '../repository/cermon-report.repository';
import { JadwalIbadahService } from '../../cermon-schedule/services/jadwal-ibadah.service';
import { Transactional } from 'typeorm-transactional';
import { GkkdServiceService } from '../../../../modules/gkkd-service/services/gkkd-service.service';

@Injectable()
export class ReportIbadahService {
  constructor(
    @InjectRepository(CermonReportEntity)
    private readonly reportRepository: Repository<CermonReportEntity>,
    private readonly customReportRepository: CermonReportRepository,
    private readonly cermonService: JadwalIbadahService,
    private readonly regionService: RegionService,
    private dataSource: DataSource,
    private readonly gkkdService: GkkdServiceService,
  ) {}

  @Transactional()
  async create(dto: CreateReportIbadahDto) {
    try {
      const cermon = await this.cermonService.getOne(dto.cermon_id);
      if (!cermon) throw new BadRequestException('cermon is not found!');
  
      const isExist = await this.reportRepository.findOne({
        where: { cermon_id: cermon.id, date: new Date(dto.date) },
      });
      if (isExist) throw new BadRequestException('data report already exist');
  
      const createReport = this.reportRepository.create({
        date: new Date(dto.date),
        total_male: dto.total_male,
        total_female: dto.total_female,
        total_new_male: dto.total_new_male,
        total_new_female: dto.total_new_female,
        cermon_id: cermon.id,
        region_id: cermon.region_id,
      });
  
      await this.reportRepository.save(createReport);
    } catch (error) {
      throw new BadRequestException('data can not be created');
      
    }
  }

  async getDashboardData(dto: FilterReportDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    const averageThisMonth = await this.customReportRepository.getAverageMonthly(dto);
    const averageLastMonth = await this.customReportRepository.getAverageLastMonth(dto);

    const devider = Number(averageLastMonth?.average) ? Number(averageLastMonth?.average) : 1;

    let percentage = ((Number(averageThisMonth?.average) - Number(averageLastMonth?.average)) / devider) * 100;
    return {
      total: Math.round(Number(averageThisMonth?.average)),
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  async findAll(dto: FilterReportDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: dto?.region_id });
    dto.region_ids = regions.map((data) => data.id);

    if (dto.cermon_id) {
      const cermon = await this.cermonService.getOne(dto.cermon_id);
      if (!cermon) throw new BadRequestException('cermon is not found!');
      dto.cermon_unique_id = cermon.unique_id;
    }

    try {
      const result = await this.customReportRepository.getAll(dto);
      return result;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException();
    }
  }

  findOne(id: number, region_id?: number) {
    return this.customReportRepository.getOne(id);
  }

  getReportOne(date: Date, cermon_id: number, region_id?: number): Promise<CermonReportEntity | null> {
    return this.customReportRepository.findOne({where: {
      date: new Date(date),
      cermon_id: cermon_id,
      region_id: region_id,
    }});
  }

  async update(id: number, dto: UpdateReportIbadahDto) {
    const report = await this.findOne(id);
    if (!report) throw new BadRequestException('report is not found!');

    const cermon = await this.cermonService.getOne(dto.cermon_id);
    if (!cermon) throw new BadRequestException('cermon is not found!');

    const isExist = await this.reportRepository.findOne({
      where: { cermon_id: cermon.id, date: new Date(dto.date) },
    });
    if (isExist && isExist.id !== report.id) throw new BadRequestException('data report already exist');

    const updateReport = this.reportRepository.create({
      ...report,
      ...dto,
      date: new Date(dto.date),
      cermon_id: cermon.id,
      region_id: cermon.region_id,
    } as CermonReportEntity);
    
    await this.reportRepository.update(report.id, updateReport)
  }

  async remove(id: number, region_id?: number) {
    const report = await this.findOne(id, region_id);
    if (!report) throw new BadRequestException('report is not found!');

    this.reportRepository.remove(report);
  }

  async upload(listData: Partial<CermonReportEntity>[], cermon_ids?: string[]) {
    const batchSize = 1000; // Define the batch size
    const totalBatches = Math.ceil(listData.length / batchSize);
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      let batch = listData.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

      // for (const bc of batch) {
      //   if (!cermon_ids?.includes(bc.cermon_id)) throw new BadRequestException('not valid cermon_id in file');
      // }

      try {
        await this.dataSource.transaction(async (manager) => {
          await manager
            .createQueryBuilder()
            .insert()
            .into(CermonReportEntity)
            .values(batch)
            .orUpdate(['total_male', 'total_female', 'total_new_male', 'total_new_female'], ['date', 'cermon_id'])
            .execute();
        });
      } catch (error) {
        console.log({ error });
        throw new BadRequestException('data can not be uploaded');
      }
    }
  }

  async getReportByRegion(filter: any) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_id });
    const region_ids = regions.map((data) => data.id);
    return this.customReportRepository.getReportByRegion({ region_ids });
  }

  async export(cermon_ids?: number[]) {
    try {
      const result = await this.customReportRepository.getExport(cermon_ids);

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  @Transactional()
  async syncById(id: number, region_id?: number) {
    const report = await this.customReportRepository.findOne({
      where: {
        id: id,
        region_id: region_id,
        is_sync: false,
      },
      relations: ['cermon'],
    })
    if (!report) throw new BadRequestException('report have been sync!');

    // sync service
    await this.gkkdService.syncIbadah({
      tanggal: new Date(report.date).toISOString().split('T')[0],
      ibadah: report.cermon.name,
      pelayanan: report.cermon.segment,
      onsite_pria: report.total_male,
      onsite_wanita: report.total_female,
      onsite_total: report.total_male + report.total_female,
      online_pria: 0,
      online_wanita: 0,
      online_total: 0,
      orba_pria: report.total_new_male,
      orba_wanita: report.total_new_female,
    })

    return this.reportRepository.save({
      ...report,
      is_sync: true,
    });
  }

  @Transactional()
  async syncAll(region_id?: number) {
    const reportList = await this.customReportRepository.find({
      where: {
        region_id: region_id,
        is_sync: false,
      },
      relations: ['cermon'],
    })
    if (!reportList.length) throw new BadRequestException('all report have been sync!');

    for (const [index, report] of reportList.entries()) {
      await this.gkkdService.syncIbadah({
        tanggal: new Date(report.date).toISOString().split('T')[0],
        ibadah: report.cermon.alias,
        pelayanan: report.cermon.segment,
        onsite_pria: report.total_male,
        onsite_wanita: report.total_female,
        onsite_total: report.total_male + report.total_female,
        online_pria: 0,
        online_wanita: 0,
        online_total: 0,
        orba_pria: report.total_new_male,
        orba_wanita: report.total_new_female,
      });

      reportList[index].is_sync = true;
    }

    return this.reportRepository.save(reportList);
  }

}
