import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../../common/constant/role.constant';
import { RegionEntity } from '../../../modules/region/entities/region.entity';

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
