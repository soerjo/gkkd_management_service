import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { JemaatEntity } from 'src/modules/jemaat/entities/jemaat.entity';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

export class PemuridanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  lead: JemaatEntity;

  @ApiProperty()
  @IsString({each: true})
  @IsNotEmpty()
  members: string[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  region_id: string;

  region: RegionEntity
}
