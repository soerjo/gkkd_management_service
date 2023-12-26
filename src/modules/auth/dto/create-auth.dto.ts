import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
