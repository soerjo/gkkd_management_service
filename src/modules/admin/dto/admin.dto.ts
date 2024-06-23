import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/constant/role.constant';
import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { JemaatEntity } from 'src/modules/jemaat/jemaat/entities/jemaat.entity';
import { Type } from 'class-transformer';

export class AdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsEnum(RoleEnum, { each: true })
  @IsNotEmpty()
  role: RoleEnum;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  region?: RegionEntity;
}
