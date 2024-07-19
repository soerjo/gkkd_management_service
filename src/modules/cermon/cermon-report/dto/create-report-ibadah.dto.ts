import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, IsOptional, Min, IsDateString, ValidateIf } from 'class-validator';

export class CreateReportIbadahDto {
  region_id: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  cermon_schedule_id: number;

  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total_male: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total_female: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total_new_male: number;

  @ApiProperty()
  // @IsNumber()
  // @Min(0)
  @ValidateIf(
    (ob) => {
      console.log({ isvalid: ob.total_female > ob.total_new_female });
      return ob.total_female > ob.total_new_female;
    },
    {
      always: true,
    },
  )
  total_new_female: number;
}
