import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { JemaatEntity } from '../../../../modules/jemaat/jemaat/entities/jemaat.entity';

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
  @IsOptional()
  lead_id: number;

  lead: JemaatEntity;
}
