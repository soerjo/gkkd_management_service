import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { GenderEnum } from "../../../../common/constant/gender.constant"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateDatumDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    alias: string

    @ApiProperty({enum: GenderEnum})
    @IsEnum(GenderEnum)
    gender: GenderEnum

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    blesscomn_id: number

    @ApiProperty()
    @IsNumber()
    segment_id: number
}
