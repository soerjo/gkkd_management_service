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
import { JemaatEntity } from 'src/modules/jemaat/entities/jemaat.entity';
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
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  @IsNotEmpty()
  @Type(() => String)
  role: RoleEnum[];

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  regions?: RegionEntity[];

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  jemaat_id?: string;

  jemaat?: JemaatEntity;
}
