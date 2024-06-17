import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @Min(1)
  @IsNumber()
  @Transform((val) => Number(val.value))
  @IsOptional()
  take?: number = 10;

  @ApiPropertyOptional()
  @Min(0)
  @IsNumber()
  @Transform((val) => Number(val.value))
  @IsOptional()
  page?: number = 1;
}
