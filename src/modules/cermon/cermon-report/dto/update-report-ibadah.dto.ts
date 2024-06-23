import { PartialType } from '@nestjs/swagger';
import { CreateReportIbadahDto } from './create-report-ibadah.dto';

export class UpdateReportIbadahDto extends PartialType(CreateReportIbadahDto) {}
