import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNumber } from "class-validator";

export class CreateReportDto {
    @ApiProperty()
    @IsNumber()
    hospitality_data_id: number;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @ApiProperty()
    @IsNumber()
    sunday_service_id: number;
}
