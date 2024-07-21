import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BooksEnum } from '../../../../common/constant/books.constant';
import { JemaatEntity } from '../../../../modules/jemaat/jemaat/entities/jemaat.entity';
import { RegionEntity } from '../../../../modules/region/entities/region.entity';

export class PemuridanDto {
  name?: string;

  // @ApiProperty({ enum: BooksEnum })
  // @IsEnum(BooksEnum)
  // @IsNotEmpty()
  // book_level: BooksEnum;

  // @ApiProperty()
  // @IsNotEmpty()
  // lead_id: number;

  // lead: JemaatEntity;

  // @ApiProperty()
  // @IsArray()
  // @ArrayMinSize(1, { message: 'members must contain at least 1 desciple' })
  // @IsString({ each: true })
  // @IsNotEmpty()
  // members: string[];

  // @ApiProperty()
  // @IsNumber()
  // @Min(1)
  // @IsOptional()
  // region_id?: number;

  // region?: RegionEntity;
}
