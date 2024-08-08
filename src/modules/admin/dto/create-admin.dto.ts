import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateAdminDto extends AdminDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  region_id?: number;
}
