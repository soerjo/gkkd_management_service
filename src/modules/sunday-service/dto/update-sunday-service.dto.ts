import { PartialType } from '@nestjs/swagger';
import { CreateSundayServiceDto } from './create-sunday-service.dto';

export class UpdateSundayServiceDto extends PartialType(CreateSundayServiceDto) {}
