import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class CreateMaritalDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nijHusban: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nikHusban: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nijWife: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nikWife: string;

  @ApiProperty()
  @IsString()
  @Transform((e) => String(e.value).toLowerCase())
  husband_name: string;

  @ApiProperty()
  @IsString()
  @Transform((e) => String(e.value).toLowerCase())
  wife_name: string;

  @ApiProperty()
  @IsDateString()
  wedding_date: Date;

  @ApiProperty()
  @IsString()
  @Transform((e) => String(e.value).toLowerCase())
  pastor: string;

  @ApiProperty()
  @IsString()
  @Transform((e) => String(e.value).toLowerCase())
  witness_1: string;

  @ApiProperty()
  @IsString()
  @Transform((e) => String(e.value).toLowerCase())
  witness_2: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photo_url?: string;
  // url foto

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  document_url?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  region_id: number;
}
