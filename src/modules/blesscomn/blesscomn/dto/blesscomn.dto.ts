import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { JemaatEntity } from 'src/modules/jemaat/jemaat/entities/jemaat.entity';
import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { IsAtLeastOnePropertyNotEmpty } from '../decorator/notEmpty-validator.decorator';

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
