import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';
import { IsNumber } from 'class-validator';

export class CreateAdminDto extends AdminDto {
  @ApiPropertyOptional()
  @IsNumber()
  regions_id?: number;
}
