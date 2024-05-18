import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { SundayServiceEntity } from 'src/modules/sunday-service/entities/sunday-service.entity';

export class ReportRegionDto {
  @ApiProperty()
  @IsDateString({ strict: true })
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Transform((val) => Number(val.value))
  @IsNotEmpty()
  total_male: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Transform((val) => Number(val.value))
  @IsNotEmpty()
  total_female: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Transform((val) => Number(val.value))
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Transform((val) => Number(val.value))
  @IsNotEmpty()
  new: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  sunday_service_id: string;

  sunday_service?: SundayServiceEntity;
}
