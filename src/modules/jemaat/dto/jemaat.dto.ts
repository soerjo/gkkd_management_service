import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class JemaatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sexs: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  place_birthday: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date_birthday: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  father_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mother_name: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  birth_order: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  total_brother_sister: number;

  @ApiProperty()
  @IsBoolean()
  @Transform((val) => Boolean(val.value === 'true' ? true : false))
  @IsNotEmpty()
  marital_status: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  husband_wife_name: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  wedding_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  region_service: string;
}
