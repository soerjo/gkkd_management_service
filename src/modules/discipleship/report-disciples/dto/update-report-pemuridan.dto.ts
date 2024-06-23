import { PartialType } from '@nestjs/swagger';
import { CreateReportPemuridanDto } from './create-report-pemuridan.dto';

export class UpdateReportPemuridanDto extends PartialType(CreateReportPemuridanDto) {}
