import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JemaatEntity } from '../../../../modules/jemaat/jemaat/entities/jemaat.entity';
import { RegionEntity } from '../../../../modules/region/entities/region.entity';

export class BlesscomnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsOptional()
  lead_id?: number;

  lead_jemaat?: JemaatEntity;

  @ApiProperty()
  @IsOptional()
  region_id?: number;

  region?: RegionEntity;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  members?: string[];
}
