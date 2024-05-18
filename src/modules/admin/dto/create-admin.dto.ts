import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AdminDto } from './admin.dto';

export class CreateAdminDto extends AdminDto {
  @ApiPropertyOptional()
  @IsUUID()
  regions_id?: string;
}
