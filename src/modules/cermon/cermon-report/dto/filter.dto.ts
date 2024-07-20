import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

export class FilterReportDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  segment: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  date_from: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  date_to: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  region_id: number;

  region_ids: number[];
}
