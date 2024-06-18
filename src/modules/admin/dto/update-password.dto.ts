import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  new_password: string;
}
