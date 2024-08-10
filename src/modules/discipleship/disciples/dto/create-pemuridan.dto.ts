import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { BooksEnum } from '../../../../common/constant/books.constant';

export class CreatePemuridanDto {
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
  @IsNumber()
  @IsOptional()
  pembimbing_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  group_id?: number;

  group_unique_id?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  region_id?: number;
}
