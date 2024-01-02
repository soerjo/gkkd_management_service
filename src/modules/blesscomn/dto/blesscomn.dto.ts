import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { JemaatEntity } from 'src/modules/jemaat/entities/jemaat.entity';
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
  @IsString()
  @IsOptional()
  lead: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  lead_id: string;

  lead_jemaat: JemaatEntity

  @IsAtLeastOnePropertyNotEmpty({ message: 'At least fill lead_id or lead' })
  validationPlaceholder: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  region_id: string;

  region: RegionEntity

  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty()
  members: string[];
}
