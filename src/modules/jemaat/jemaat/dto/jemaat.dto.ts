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
  IsUUID,
  Min,
} from 'class-validator';
import { GenderEnum } from 'src/common/constant/gender.constant';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

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
  @IsEmail()
  @IsNotEmpty()
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
  father_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
  husband_wife_name?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  wedding_date?: Date;

  // region_service?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  region_id: number;

  // region: RegionEntity;
}
