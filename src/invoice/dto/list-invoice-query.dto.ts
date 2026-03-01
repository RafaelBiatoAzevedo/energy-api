import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListInvoicesQueryDto {
  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  clientNumber?: string;

  @ApiPropertyOptional({ example: '2024-01' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'startMonth must be in format YYYY-MM',
  })
  startMonth?: string;

  @ApiPropertyOptional({ example: '2024-06' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'endMonth must be in format YYYY-MM',
  })
  endMonth?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
