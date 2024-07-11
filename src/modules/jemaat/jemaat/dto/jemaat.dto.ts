import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GenderEnum } from '../../../../common/constant/gender.constant';

export class JemaatDto {
  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  nik: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((e) => String(e.value).toLowerCase())
  full_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((e) => String(e.value).toLowerCase())
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform((e) => String(e.value).toLowerCase())
  email: string;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  place_birthday: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date_birthday: Date;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform((e) => String(e.value).toLowerCase())
  father_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform((e) => String(e.value).toLowerCase())
  mother_name?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  birth_order?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  total_brother_sister?: number;

  @ApiProperty()
  @IsBoolean()
  @Transform((val) => Boolean(val.value === 'true' ? true : false))
  @IsOptional()
  marital_status?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform((e) => String(e.value).toLowerCase())
  husband_wife_name?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Transform((e) => String(e.value).toLowerCase())
  wedding_date?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  region_id: number;
}
