import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class ReportPemuridanDto {
  @ApiProperty()
  @IsDateString({ strict: true })
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Transform((val) => Number(val.value))
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsNotEmpty()
  pemuridan_id: number;
}
