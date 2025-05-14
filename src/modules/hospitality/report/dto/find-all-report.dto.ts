import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class FindAllReportDto extends PaginationDto { 
    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    sunday_service_id: number;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    // @Type(() => Boolean)
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isVersion: boolean;

    region_id?: number;
}