import { Module } from '@nestjs/common';
import { OrganizationBlesscomnService } from './organization-blesscomn.service';
import { OrganizationBlesscomnController } from './organization-blesscomn.controller';

@Module({
  controllers: [OrganizationBlesscomnController],
  providers: [OrganizationBlesscomnService],
})
export class OrganizationBlesscomnModule {}
