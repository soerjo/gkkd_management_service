import { PartialType } from '@nestjs/swagger';
import { CreateGkkdServiceDto } from './create-gkkd-service.dto';

export class UpdateGkkdServiceDto extends PartialType(CreateGkkdServiceDto) {}
