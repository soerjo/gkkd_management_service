import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tag: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pembimbing_nim: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  region_id: number;
}
