import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportRegionDto } from '../dto/create-report-region.dto';
import { UpdateReportRegionDto } from '../dto/update-report-region.dto';
import { ReportRegionRepository } from '../repository/report-region.repository';
import { FilterDto } from '../dto/filter.dto';
import { RegionService } from 'src/modules/region/services/region.service';

@Injectable()
export class ReportRegionService {
  constructor(
    private readonly reportRegionRepository: ReportRegionRepository,
    private readonly regionService: RegionService,
  ){}

  async create(createReportRegionDto: CreateReportRegionDto) {
    const region = await this.regionService.getOneById(createReportRegionDto.region_id)
    if(!region) throw new BadRequestException({ message: 'Region is not found!'})
    createReportRegionDto.region = region

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

    if(updateReportRegionDto.region_id){
      const region = await this.regionService.getOneById(updateReportRegionDto.region_id)
      if(!region) throw new BadRequestException({ message: 'Region is not found!'})
      updateReportRegionDto.region = region
    }

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

    return { id }
  }
}
