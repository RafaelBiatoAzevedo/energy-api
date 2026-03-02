import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getConsolidatedData(clientNumber?: string, referenceMonth?: string) {
    return this.prisma.energyInvoice.findMany({
      where: {
        ...(clientNumber && {
          client: {
            clientNumber: clientNumber,
          },
        }),
        ...(referenceMonth && { referenceMonth }),
      },
      select: {
        referenceMonth: true,
        consumptionElectricalEnergyKwh: true,
        consumptionEnergySCEEKwh: true,
        compensatedEnergyGDKwh: true,
        electricalEnergyAmount: true,
        energySCEEAmount: true,
        compensatedEnergyGDAmount: true,
      },
      orderBy: { referenceMonth: 'asc' },
    });
  }
}
