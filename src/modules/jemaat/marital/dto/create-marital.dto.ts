import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaritalDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nijHusban: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nijWife: string;

  @ApiProperty()
  @IsString()
  unique_code: string;

  @ApiProperty()
  @IsString()
  husband_name: string;

  @ApiProperty()
  @IsString()
  husban_id: string;

  @ApiProperty()
  @IsString()
  wife_name: string;

  @ApiProperty()
  @IsString()
  wife_id: string;

  @ApiProperty()
  @IsDateString()
  wedding_date: Date;

  @ApiProperty()
  @IsString()
  pastor: string;

  @ApiProperty()
  @IsString()
  witness_1: string;

  @ApiProperty()
  @IsString()
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

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  region_id: number;
}
