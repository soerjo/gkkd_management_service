import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { HospitalityReportRepository } from '../repositories/hospitality-report.repository';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
import { JadwalIbadahService } from '../../../../modules/cermon/cermon-schedule/services/jadwal-ibadah.service';
import { HospitalityDataService } from '../../data/services/data.service';
import { FindAllReportDto } from '../dto/find-all-report.dto';
import { GetReportDto } from '../dto/get-report.dto';
import { Propagation, Transactional } from 'typeorm-transactional';
import { ReportIbadahService } from 'src/modules/cermon/cermon-report/services/cermon-report.service';
import { GenderEnum } from 'src/common/constant/gender.constant';
import { HospitaltityDataEntity } from '../../data/entities/hospitality-data.entity';
import { CermonReportEntity } from 'src/modules/cermon/cermon-report/entities/cermon-report.entity';
import { RegenerateReportDto } from '../dto/regenerate-report.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly hospitalityReportRepository: HospitalityReportRepository,
    private readonly hospitalityDataService: HospitalityDataService,
    private readonly cermonService: JadwalIbadahService,
    private readonly cermonReportService: ReportIbadahService,
  ) {}

  @Transactional()
  async create(createReportDto: CreateReportDto, jwtPayload: IJwtPayload) {
    const hospitalityData = await this.hospitalityDataService.findOne(createReportDto.hospitality_data_id);
    if (!hospitalityData) throw new BadRequestException('hospitality data not found');

    const isExist = await this.hospitalityReportRepository.findOne({
      where: {
        hospitality_data_id: hospitalityData.id,
        sunday_service_id: createReportDto.sunday_service_id,
        date: new Date(createReportDto.date).toDateString(),
      }
    })
    if (isExist) throw new BadRequestException('report already exist');
    
    const cermon = await this.cermonService.getOne(createReportDto.sunday_service_id, jwtPayload.region_id);
    if (!cermon) throw new BadRequestException('cermon not found');

    const createRepor = this.hospitalityReportRepository.create({
      hospitality_data_id: createReportDto.hospitality_data_id,
      sunday_service_id: createReportDto.sunday_service_id,
      date: createReportDto.date,
      region_id: jwtPayload.region.id,
      created_by: jwtPayload.id,
    })
    
    await this.hospitalityReportRepository.save(createRepor);
    // await this.generateReport(createReportDto, hospitalityData, jwtPayload);
  }

  async getTotalReport(dto: RegenerateReportDto, jwtPayload?: IJwtPayload) {
    const reportList = await this.hospitalityReportRepository.find({
      where: { sunday_service_id: dto.cermon_id, date: dto.date.toDateString() },
      relations: ['hospitality_data'],
    });
    
    let total_female = 0;
    let total_new_female = 0;
    let total_new_male = 0;
    let total_male = 0;
    
    for (const report of reportList) {
      const dataDate = report.hospitality_data.created_at.toDateString();
      const isToday = dataDate === dto.date.toDateString();
      const isFemale = report.hospitality_data.gender === GenderEnum.FEMALE;
      const isMale = report.hospitality_data.gender === GenderEnum.MALE;

      if (isFemale) {
        if (isToday) {
          total_new_female += 1;
        } else {
          total_female += 1;
        }
      }

      if (isMale) {
        if (isToday) {
          total_new_male += 1;
        } else {
          total_male += 1;
        }
      }
    }

    return {
      total_female,
      total_new_female,
      total_new_male,
      total_male,
      total: total_female + total_new_female + total_new_male + total_male,
    };
  }

  @Transactional()
  async reGenreateReport(dto: RegenerateReportDto, jwtPayload?: IJwtPayload) {
    const {
      total_female,
      total_new_female,
      total_new_male,
      total_male,
    } = await this.getTotalReport(dto)

    let cermonReportToday = await this.cermonReportService.getReportOne(
      dto.date, 
      dto.cermon_id
    );

    if (!cermonReportToday) {
      await this.cermonReportService.create({
        date: dto.date,
        cermon_id: dto.cermon_id,
        total_female,
        total_new_female,
        total_new_male,
        total_male,
      });

      return;
    }

    await  this.cermonReportService.update(cermonReportToday.id, {
      ...cermonReportToday,
      total_female,
      total_new_female,
      total_new_male,
      total_male,
    })

    return;
  }

  async generateReport(createReportDto: CreateReportDto, hospitalityData: HospitaltityDataEntity, jwtPayload?: IJwtPayload) {
    const today = new Date().toDateString();
    const dataDate = hospitalityData.created_at.toDateString();
    const isToday = dataDate === today;
    const isFemale = hospitalityData.gender === GenderEnum.FEMALE;
    const isMale = hospitalityData.gender === GenderEnum.MALE;

    let cermonReportToday = await this.cermonReportService.getReportOne(
      createReportDto.date, 
      createReportDto.sunday_service_id
    );

    if (!cermonReportToday) {
      const total_female = isFemale && !isToday ? 1 : 0;
      const total_new_female = isFemale && isToday ? 1 : 0;
      const total_new_male = isMale && isToday ? 1 : 0;
      const total_male = isMale && !isToday ? 1 : 0;

      await this.cermonReportService.create({
        date: createReportDto.date,
        cermon_id: createReportDto.sunday_service_id,
        total_female,
        total_new_female,
        total_new_male,
        total_male,
      });

      return;
    }

    if (isFemale) {
      if (isToday) {
        cermonReportToday.total_new_female += 1;
      } else {
        cermonReportToday.total_female += 1;
      }
    }

    if (isMale) {
      if (isToday) {
        cermonReportToday.total_new_male += 1;
      } else {
        cermonReportToday.total_male += 1;
      }
    }

    await this.cermonReportService.update(cermonReportToday.id, {
      ...cermonReportToday,
    })

    return;
  }

  findAll(dto: FindAllReportDto, jwtPayload: IJwtPayload) {
    return this.hospitalityReportRepository.getAll({...dto, region_id: jwtPayload.region.id});
  }

  async getSundayService(dto: GetReportDto, jwtPayload: IJwtPayload) {
    const querySum = this.hospitalityReportRepository.getSumPerSegment({...dto, region_id: jwtPayload.region.id});
    const queryCount = this.getTotalReport({cermon_id: dto.sunday_service_id, date: dto.date})
    const [sum, count] = await Promise.all([querySum, queryCount]);

    return { sum, count };
  }

  async delete(dto: CreateReportDto, jwtPayload?: IJwtPayload){
    const isExist = await this.hospitalityReportRepository.findOne({
      where: {
        hospitality_data_id: dto.hospitality_data_id,
        sunday_service_id: dto.sunday_service_id,
        date: new Date(dto.date).toDateString(),
      }
    })
    if (!isExist) throw new BadRequestException('report not found!');

    await this.hospitalityReportRepository.remove(isExist);
  }

  async remove(id: number, jwtPayload?: IJwtPayload) {
    const report = await this.hospitalityReportRepository.findOne({
      where: { id },
      relations: ['hospitality_data'],
    });
    if (!report) throw new BadRequestException('report not found');

    await this.hospitalityReportRepository.remove(report);

    // const cermonReportToday = await this.cermonReportService.getReportOne(
    //   new Date(report.date), 
    //   report.sunday_service_id
    // );

    // if(report.hospitality_data.gender === GenderEnum.MALE) {
    //   if(report.hospitality_data.created_at.toDateString() === new Date().toDateString()) {
    //     cermonReportToday.total_new_female -= 1;
    //   } else {
    //     cermonReportToday.total_female -= 1;
    //   }
    // }
    // if(report.hospitality_data.gender === GenderEnum.MALE) {
    //   if(report.hospitality_data.created_at.toDateString() === new Date().toDateString()) {
    //     cermonReportToday.total_new_male -= 1;
    //   } else {
    //     cermonReportToday.total_male -= 1;
    //   }
    // } 

    // if (!cermonReportToday) {
    //   await this.cermonReportService.update(cermonReportToday.id, {
    //     ...cermonReportToday,
    //   })
    // }
  }
}
