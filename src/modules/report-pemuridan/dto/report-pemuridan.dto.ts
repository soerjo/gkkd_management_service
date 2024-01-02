import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator"
import { PemuridanEntity } from "src/modules/pemuridan/entities/pemuridan.entity"

export class ReportPemuridanDto {
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: Date

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    material: string

    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Transform(val => Number(val.value))
    @IsNotEmpty()
    total: number

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    pemuridan_id: string;
  
    pemuridan: PemuridanEntity
}