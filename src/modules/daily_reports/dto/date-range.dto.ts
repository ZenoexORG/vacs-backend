import { ApiProperty } from "@nestjs/swagger";
import { IsDate } from "class-validator";

export class DateRangeDto {
  @ApiProperty({
    example: "2025-01-01",
    description: "Start date in YYYY-MM-DD format",
    type: Date,
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: "2025-01-31",
    description: "End date in YYYY-MM-DD format",
    type: Date,
  })
  @IsDate()
  endDate: Date;
}