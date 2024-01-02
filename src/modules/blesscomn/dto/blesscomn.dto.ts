import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

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
  @IsString()
  @IsNotEmpty()
  lead: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty()
  members: string[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  region_id: string;

  region: RegionEntity
}
