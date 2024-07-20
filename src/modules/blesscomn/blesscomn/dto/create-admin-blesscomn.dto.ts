import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateAdminBlesscomnDto {
  @ApiProperty()
  @IsNumber()
  admin_id: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsNumber({}, { each: true })
  blesscomn_ids: number[];

  region_id: number;
}
