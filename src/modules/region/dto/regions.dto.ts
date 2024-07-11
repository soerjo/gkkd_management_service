import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((e) => String(e.value).toUpperCase())
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  alt_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;
}
