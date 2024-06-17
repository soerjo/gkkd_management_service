import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class CreateAdminDto extends AdminDto {
  @ApiPropertyOptional()
  regions_id?: number;
}
