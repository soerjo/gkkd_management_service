import { PartialType } from '@nestjs/swagger';
import { CreateCermonSchedulerDto } from './create-cermon-scheduler.dto';

export class UpdateCermonSchedulerDto extends PartialType(CreateCermonSchedulerDto) {}
