import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Matches, Max } from 'class-validator';

const timeFormatRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export enum DayEnum {
  SENIN = 'Senin',
  SELASA = 'Selasa',
  RABU = 'Rabu',
  KAMIS = 'Kamis',
  JUMAT = 'Jumat',
  SABTU = 'Sabtu',
  MINGGU = 'Minggu',
}

export class CreateJadwalIbadahDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  alias: string;

  @ApiProperty()
  @IsString()
  @Matches(timeFormatRegex, { message: 'Time must be in the format hh:mm' })
  time: string;

  @ApiProperty({ enum: DayEnum })
  @IsEnum(DayEnum)
  day: DayEnum;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  region_id?: number;

  @ApiProperty()
  @IsString()
  segment: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
