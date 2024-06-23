import { PartialType } from '@nestjs/swagger';
import { CreateReportBlesscomnDto } from './create-report-blesscomn.dto';

export class UpdateReportBlesscomnDto extends PartialType(CreateReportBlesscomnDto) {}
