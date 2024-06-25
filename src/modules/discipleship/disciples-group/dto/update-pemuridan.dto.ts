import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePemuridanDto } from './create-pemuridan.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePemuridanDto extends PartialType(CreatePemuridanDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}
