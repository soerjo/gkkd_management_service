import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BlesscomnEntity } from '../../../../modules/blesscomn/blesscomn/entities/blesscomn.entity';
import { Type } from 'class-transformer';

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
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  region_id: number;

  region_ids?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  blesscomn_id: number;

  blesscomn?: BlesscomnEntity;
}
