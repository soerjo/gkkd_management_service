import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBaptisanDto {
  @ApiProperty()
  @IsString()
  nij: string;

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
  @IsOptional()
  region_id: number;
}
