import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class FindAllReportDto { 
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