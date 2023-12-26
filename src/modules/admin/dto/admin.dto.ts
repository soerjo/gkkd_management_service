import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/constant/role.constant';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

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
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  regions?: RegionEntity[];
}
