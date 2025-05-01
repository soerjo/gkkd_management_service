import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSegmentDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    alias: string;

    @ApiPropertyOptional()
    @IsString()
    description: string;    
}
