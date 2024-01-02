import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportRegionDto } from '../dto/create-report-region.dto';
import { UpdateReportRegionDto } from '../dto/update-report-region.dto';
import { ReportRegionRepository } from '../repository/report-region.repository';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class ReportRegionService {
  constructor(private readonly reportRegionRepository: ReportRegionRepository){}

  create(createReportRegionDto: CreateReportRegionDto) {
    const reportRegion = this.reportRegionRepository.create(createReportRegionDto)
    return this.reportRegionRepository.save(reportRegion)
  }

  findAll(filter: FilterDto) {
    return this.reportRegionRepository.find()
  }

  findOne(id: string) {
    return this.reportRegionRepository.findOneBy({ id })
  }

  async update(id: string, updateReportRegionDto: UpdateReportRegionDto) {
    const pastReportRegion = await this.findOne(id)
    if(!pastReportRegion) throw new BadRequestException({message: "region report is not found!"})

    await this.reportRegionRepository.save({
      ...pastReportRegion,
      ...updateReportRegionDto,
    })

    return { id }
  }

  async remove(id: string) {
    const pastReportRegion = await this.findOne(id)
    if(!pastReportRegion) throw new BadRequestException({message: "region report is not found!"})

    await this.reportRegionRepository.softRemove(pastReportRegion)

    return id
  }
}
