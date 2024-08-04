import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { RoleEnum } from '../../../common/constant/role.constant';

export class FilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  region_id: number;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsOptional()
  role: RoleEnum;

  user_region_id: number;

  region_tree_id: number;
  region_ids: number[] = [];
}
