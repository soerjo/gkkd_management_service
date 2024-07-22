import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

export class FilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsDateString({ strict: true })
  @IsOptional()
  date_from: Date;

  @ApiPropertyOptional()
  @IsDateString({ strict: true })
  @IsOptional()
  date_to: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pembimbing_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  region_id: number;

  disciple_tree_id: number;
  disciple_ids: number[];

  region_tree_id: number;
  region_ids: number[];
}
