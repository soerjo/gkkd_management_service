import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @Min(5)
  @IsNumber()
  @IsOptional()
  take: number;

  @ApiPropertyOptional()
  @Min(0)
  @IsNumber()
  @IsOptional()
  page: number;
}
