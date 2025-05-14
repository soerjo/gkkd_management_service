import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class GetReportDto extends PaginationDto { 
    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    sunday_service_id: number;

    region_id?: number;
}