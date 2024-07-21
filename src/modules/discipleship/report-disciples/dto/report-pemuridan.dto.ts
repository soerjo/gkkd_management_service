import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ReportPemuridanDto {
  @ApiProperty()
  @IsDateString({ strict: true })
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  disciple_group_id: number;
}
