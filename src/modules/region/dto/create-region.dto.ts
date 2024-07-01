import { IsNumber, IsOptional } from 'class-validator';
import { RegionDto } from './regions.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto extends RegionDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parent_id?: number;
}
