import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportPemuridanDto } from '../dto/create-report-pemuridan.dto';
import { UpdateReportPemuridanDto } from '../dto/update-report-pemuridan.dto';
import { ReportPemuridanRepository } from '../repository/report-pemuridan.repository';
import { FilterDto } from '../dto/filter.dto';
import { PemuridanService } from 'src/modules/pemuridan/services/pemuridan.service';

@Injectable()
export class ReportPemuridanService {
  constructor(
    private readonly reportPemuridanRepository: ReportPemuridanRepository,
    private readonly pemuridanService: PemuridanService,
  ){}

  async create(createReportPemuridanDto: CreateReportPemuridanDto) {
    const pemuridan = await this.pemuridanService.findOne(createReportPemuridanDto.pemuridan_id)
    if(!pemuridan) throw new BadRequestException({message: 'Pemuridan is not found!'})
    createReportPemuridanDto.pemuridan = pemuridan

    const reportPemuridan = this.reportPemuridanRepository.create(createReportPemuridanDto)
    return this.reportPemuridanRepository.save(reportPemuridan)
  }

  findAll(filter: FilterDto) {
    return this.reportPemuridanRepository.find()
  }

  findOne(id: string) {
    return this.reportPemuridanRepository.findOneBy({ id })
  }

  async update(id: string, updateReportPemuridanDto: UpdateReportPemuridanDto) {
    const pastReportPemuridan = await this.findOne(id)
    if(!pastReportPemuridan) throw new BadRequestException({message: "Pemuridan report is not found!"})

    if(updateReportPemuridanDto.pemuridan_id){
      const pemuridan = await this.pemuridanService.findOne(updateReportPemuridanDto.pemuridan_id)
      if(!pemuridan) throw new BadRequestException({message: 'Pemuridan is not found!'})
      updateReportPemuridanDto.pemuridan = pemuridan
    }

    await this.reportPemuridanRepository.save({
      ...pastReportPemuridan,
      ...updateReportPemuridanDto,
    })

    return { id }
  }

  async remove(id: string) {
    const pastReportPemuridan = await this.findOne(id)
    if(!pastReportPemuridan) throw new BadRequestException({message: "Pemuridan report is not found!"})

    await this.reportPemuridanRepository.softRemove(pastReportPemuridan)

    return { id }
  }
}
