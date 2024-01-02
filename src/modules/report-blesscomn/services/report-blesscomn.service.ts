import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportBlesscomnDto } from '../dto/create-report-blesscomn.dto';
import { UpdateReportBlesscomnDto } from '../dto/update-report-blesscomn.dto';
import { ReportBlesscomnRepository } from '../repository/report-blesscomn.repository';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class ReportBlesscomnService {
  constructor(private readonly reportBlesscomnRepository: ReportBlesscomnRepository){}

  create(createReportBlesscomnDto: CreateReportBlesscomnDto) {
    const reportBlesscomn = this.reportBlesscomnRepository.create(createReportBlesscomnDto)
    return this.reportBlesscomnRepository.save(reportBlesscomn)
  }

  findAll(filter: FilterDto) {
    return this.reportBlesscomnRepository.find()
  }

  findOne(id: string) {
    return this.reportBlesscomnRepository.findOneBy({ id })
  }

  async update(id: string, updateReportBlesscomnDto: UpdateReportBlesscomnDto) {
    const pastReportBlesscomn = await this.findOne(id)
    if(!pastReportBlesscomn) throw new BadRequestException({message: "Blesscomn report is not found!"})

    await this.reportBlesscomnRepository.save({
      ...pastReportBlesscomn,
      ...updateReportBlesscomnDto,
    })

    return { id }
  }

  async remove(id: string) {
    const pastReportBlesscomn = await this.findOne(id)
    if(!pastReportBlesscomn) throw new BadRequestException({message: "Blesscomn report is not found!"})

    await this.reportBlesscomnRepository.softRemove(pastReportBlesscomn)

    return id
  }
}
