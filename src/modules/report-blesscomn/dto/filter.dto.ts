import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BlesscomnEntity } from 'src/modules/blesscomn/entities/blesscomn.entity';

export class FilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  region_id: string;

  region_ids?: string[];

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  blesscomn_id: string;

  blesscomn?: BlesscomnEntity;
}
