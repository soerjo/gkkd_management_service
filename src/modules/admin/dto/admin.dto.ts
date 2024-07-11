import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../../common/constant/role.constant';
import { RegionEntity } from '../../../modules/region/entities/region.entity';
import { Transform } from 'class-transformer';

export class AdminDto {
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

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  phone?: string;

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
