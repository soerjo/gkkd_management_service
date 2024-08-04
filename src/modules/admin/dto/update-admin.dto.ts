import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  blesscomn_ids?: number[];

  region_ids: number[];
  region_tree_id: number;
}
