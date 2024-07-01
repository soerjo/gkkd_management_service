import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { JemaatEntity } from '../../../../modules/jemaat/jemaat/entities/jemaat.entity';

export class FilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  lead_id: number;

  lead: JemaatEntity;
}
