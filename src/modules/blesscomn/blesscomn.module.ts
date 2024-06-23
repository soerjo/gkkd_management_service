import { Module } from '@nestjs/common';
import { ReportBlesscomnModule } from './report-blesscomn/report-blesscomn.module';
import { OrganizationBlesscomnModule } from './organization-blesscomn/organization-blesscomn.module';

@Module({
  imports: [BlesscomnModule, ReportBlesscomnModule, OrganizationBlesscomnModule],
})
export class BlesscomnModule {}
