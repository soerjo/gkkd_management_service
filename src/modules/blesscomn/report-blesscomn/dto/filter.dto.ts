import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BlesscomnEntity } from 'src/modules/blesscomn/blesscomn/entities/blesscomn.entity';

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
  region_id: number;

  region_ids?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  blesscomn_id: number;

  blesscomn?: BlesscomnEntity;
}
