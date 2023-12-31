import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JemaatEntity } from 'src/modules/jemaat/entities/jemaat.entity';

export class FilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsDateString({ strict: true })
  @IsOptional()
  date_start: Date;

  @ApiPropertyOptional()
  @IsDateString({ strict: true })
  @IsOptional()
  date_end: Date;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  lead_id: string;

  lead: JemaatEntity;
}
