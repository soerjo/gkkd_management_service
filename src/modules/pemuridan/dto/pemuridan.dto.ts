import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BooksEnum } from 'src/common/constant/books.constant';
import { JemaatEntity } from 'src/modules/jemaat/entities/jemaat.entity';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

export class PemuridanDto {
  name?: string;

  @ApiProperty({ enum: BooksEnum })
  @IsEnum(BooksEnum)
  @IsNotEmpty()
  book_level: BooksEnum;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lead_id: string;

  lead: JemaatEntity;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1, { message: 'members must contain at least 1 desciple' })
  @IsString({ each: true })
  @IsNotEmpty()
  members: string[];

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  region_id?: string;

  region?: RegionEntity;
}
