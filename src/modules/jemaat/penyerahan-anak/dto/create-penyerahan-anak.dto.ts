import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePenyerahanAnakDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nijFather: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nijMother: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  father_name: string;

  @ApiProperty()
  @IsString()
  mother_name: string;

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
  @IsNumber()
  @IsOptional()
  region_id?: number;
}
