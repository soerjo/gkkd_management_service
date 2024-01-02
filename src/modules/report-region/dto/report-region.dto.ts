import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator"
import { RegionEntity } from "src/modules/region/entities/region.entity"

export class ReportRegionDto {
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

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    region_id: string;
  
    region: RegionEntity
}