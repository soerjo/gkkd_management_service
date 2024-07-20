import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { JemaatEntity } from '../../../../modules/jemaat/jemaat/entities/jemaat.entity';
import { RegionEntity } from '../../../../modules/region/entities/region.entity';

export class BlesscomnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  time: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  day: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  segment?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsOptional()
  lead_id?: number;

  lead_jemaat?: JemaatEntity;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  region_id?: number;

  region?: RegionEntity;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  members?: string[];
}
