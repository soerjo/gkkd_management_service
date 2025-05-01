import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindSegmentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name: string;
}