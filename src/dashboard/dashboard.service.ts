import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getMetrics(clientNumber?: string, referenceMonth?: string) {
    const invoices = await this.repository.getConsolidatedData(
      clientNumber,
      referenceMonth,
    );

    const chartData = invoices.map((invoice) => {
      const consumptionTotalKwh =
        Number(invoice.consumptionElectricalEnergyKwh) +
        Number(invoice.consumptionEnergySCEEKwh);

      const compensatedGDKwh = Number(invoice.compensatedEnergyGDKwh);

      const consumptionTotalAmount =
        Number(invoice.electricalEnergyAmount) +
        Number(invoice.energySCEEAmount);

      const economyGD = Number(invoice.compensatedEnergyGDAmount);

      return {
        referenceMonth: invoice.referenceMonth,
        consumptionTotalKwh,
        compensatedGDKwh,
        consumptionTotalAmount,
        economyGD,
      };
    });

    return {
      resultsEnergyKwh: chartData.map((d) => ({
        month: d.referenceMonth,
        consumption: d.consumptionTotalKwh,
        compensated: d.compensatedGDKwh,
      })),
      resultsFinancialR$: chartData.map((d) => ({
        month: d.referenceMonth,
        consumptionTotalAmount: d.consumptionTotalAmount,
        economyGD: d.economyGD,
      })),
    };
  }
}
