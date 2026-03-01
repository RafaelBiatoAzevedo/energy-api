import { ApiProperty } from '@nestjs/swagger';

class EnergyMetric {
  @ApiProperty({ example: '2025-01' })
  month: string;
  @ApiProperty({ example: 450.5 })
  consumption: number;
  @ApiProperty({ example: 320.0 })
  compensated: number;
}

class FinancialMetric {
  @ApiProperty({ example: '2025-01' })
  month: string;
  @ApiProperty({ example: 560.8 })
  consumptionTotalAmount: number;
  @ApiProperty({ example: 120.45 })
  economyGD: number;
}

export class DashboardResponseDto {
  @ApiProperty({ type: [EnergyMetric] })
  resultsEnergyKwh: EnergyMetric[];

  @ApiProperty({ type: [FinancialMetric] })
  resultsFinancialR$: FinancialMetric[];
}
