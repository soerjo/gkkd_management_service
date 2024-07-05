import { IsNumber, IsOptional, Min } from 'class-validator';
import { RegionDto } from './regions.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto extends RegionDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  parent_id?: number;
}
