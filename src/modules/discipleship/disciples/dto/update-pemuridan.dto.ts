import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { BooksEnum } from '../../../../common/constant/books.constant';

export class UpdatePemuridanDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ enum: BooksEnum })
  @IsEnum(BooksEnum)
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  group_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  disciple_group_id?: number;
}
