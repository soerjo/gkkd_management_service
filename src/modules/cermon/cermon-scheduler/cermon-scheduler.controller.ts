import { Controller, Get } from '@nestjs/common';
import { CermonSchedulerService } from './cermon-scheduler.service';

@Controller('cermon-scheduler')
export class CermonSchedulerController {
  constructor(private readonly cermonSchedulerService: CermonSchedulerService) {}

  @Get()
  trigerWeeklyReport() {
    this.cermonSchedulerService.handletWeekly();
  }
}
