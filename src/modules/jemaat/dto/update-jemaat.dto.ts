import { PartialType } from '@nestjs/swagger';
import { CreateJemaatDto } from './create-jemaat.dto';

export class UpdateJemaatDto extends PartialType(CreateJemaatDto) {}
