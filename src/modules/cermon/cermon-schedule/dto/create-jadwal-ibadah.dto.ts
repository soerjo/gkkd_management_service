import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class CreateJadwalIbadahDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  time: string;
  // regex time format Day, HH:MM

  @ApiProperty()
  @IsNumber()
  @Max(1)
  @IsOptional()
  region_id: number;

  @ApiProperty()
  @IsString()
  segement: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
