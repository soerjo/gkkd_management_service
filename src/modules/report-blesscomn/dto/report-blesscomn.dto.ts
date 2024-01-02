import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsNotEmpty, IsNumber, Min } from "class-validator"

export class ReportBlesscomnDto {
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: Date

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Transform(val => Number(val.value))
    @IsNotEmpty()
    total_male: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Transform(val => Number(val.value))
    @IsNotEmpty()
    total_female: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Transform(val => Number(val.value))
    @IsNotEmpty()
    total: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Transform(val => Number(val.value))
    @IsNotEmpty()
    new: number
}