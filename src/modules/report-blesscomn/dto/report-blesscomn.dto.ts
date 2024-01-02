import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsNotEmpty, IsNumber, Min } from "class-validator"

export class ReportBlesscomnDto {
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: Date

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    total_male: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    total_female: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    total: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    new: number
}