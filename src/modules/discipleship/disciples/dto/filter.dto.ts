import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { JemaatEntity } from '../../../../modules/jemaat/jemaat/entities/jemaat.entity';
import { Type } from 'class-transformer';

export class FilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  lead_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  region_id: number;

  lead: JemaatEntity;
  region_tree_id: number;
  region_ids: number[];
}
