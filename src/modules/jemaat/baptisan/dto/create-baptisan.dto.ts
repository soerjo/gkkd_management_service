import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBaptisanDto {
  @ApiProperty()
  @IsString()
  nij: string;

  @ApiProperty()
  @IsDateString()
  date_baptism: Date;

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  document_url?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photo_documentation_url?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  region_id: number;
}
