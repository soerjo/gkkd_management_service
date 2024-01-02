import { PartialType } from '@nestjs/swagger';
import { CreateReportRegionDto } from './create-report-region.dto';

export class UpdateReportRegionDto extends PartialType(CreateReportRegionDto) {}
