import { PartialType } from '@nestjs/swagger';
import { CreateBaptisanDto } from './create-baptisan.dto';

export class UpdateBaptisanDto extends PartialType(CreateBaptisanDto) {
  region_ids: number[];
}
