import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaperSize {
  LETTER = 'letter',
  A4 = 'a4',
  LEGAL = 'legal'
}

export enum Orientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export class ReportOptionsDto {
  @ApiProperty({ 
    enum: PaperSize, 
    description: 'Paper size for the PDF',
    required: false,
    default: PaperSize.LETTER
  })
  @IsEnum(PaperSize)
  @IsOptional()
  paperSize?: PaperSize = PaperSize.LETTER;

  @ApiProperty({ 
    enum: Orientation, 
    description: 'PDF orientation',
    required: false,
    default: Orientation.PORTRAIT
  })
  @IsEnum(Orientation)
  @IsOptional()
  orientation?: Orientation = Orientation.PORTRAIT;

  @ApiProperty({
    type: Boolean,
    description: 'Include charts in the report',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  includeCharts?: boolean = true;

  @ApiProperty({
    type: Boolean,
    description: 'Include hourly breakdown',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  includeHourlyData?: boolean = true;
}