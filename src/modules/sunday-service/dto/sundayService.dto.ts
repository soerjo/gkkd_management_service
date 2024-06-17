import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, Validate } from 'class-validator';
import { SegmentEnum } from 'src/common/constant/segment.constant';
import { IsValidTimeFormat } from 'src/common/validation/isTimeFormat.validation';

export class SundayServiceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsValidTimeFormat()
  time: string;

  @ApiProperty()
  @IsEnum(SegmentEnum)
  segment: SegmentEnum;

  @ApiProperty()
  region_id: number;
}
