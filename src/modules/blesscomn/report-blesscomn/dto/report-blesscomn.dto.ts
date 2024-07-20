import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { BlesscomnEntity } from '../../../../modules/blesscomn/blesscomn/entities/blesscomn.entity';

export class ReportBlesscomnDto {
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
  new_male: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Transform((val) => Number(val.value))
  @IsNotEmpty()
  new_female: number;

  @ApiProperty()
  @IsOptional()
  blesscomn_id: number;

  blesscomn?: BlesscomnEntity;
}
