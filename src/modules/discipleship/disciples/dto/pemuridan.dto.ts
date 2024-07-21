import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BooksEnum } from '../../../../common/constant/books.constant';

export class PemuridanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: BooksEnum })
  @IsEnum(BooksEnum)
  @IsNotEmpty()
  book_level: BooksEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  jemaat_nij?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pembimbing_nim?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  group_id?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  region_id?: number;
}
