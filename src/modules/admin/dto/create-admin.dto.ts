import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { AdminDto } from './admin.dto';

export class CreateAdminDto extends AdminDto {
  @ApiPropertyOptional()
  @IsUUID('all', { each: true })
  regions_ids?: string[];
}
