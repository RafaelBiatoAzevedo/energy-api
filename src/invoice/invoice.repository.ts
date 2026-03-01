import { Injectable } from '@nestjs/common';
import { ExtractedInvoice } from 'src/modules/llm/llm.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoiceCalculatedValues } from './interfaces/invoiceCalculatedValues';

@Injectable()
export class InvoiceRepository {
  constructor(private prisma: PrismaService) {}

  async saveInvoice(data: {
    extracted: ExtractedInvoice;
    invoiceCalculatedValues: InvoiceCalculatedValues;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.upsert({
        where: { cnpj: data.extracted.companyCnpj },
        update: {},
        create: {
          name: data.extracted.companyName,
          cnpj: data.extracted.companyCnpj,
        },
      });

      const client = await tx.client.upsert({
        where: {
          installationNumber_companyId: {
            installationNumber: data.extracted.installationNumber,
            companyId: company.id,
          },
        },
        update: {
          name: data.extracted.clientName,
          clientNumber: data.extracted.clientNumber,
        },
        create: {
          name: data.extracted.clientName,
          clientNumber: data.extracted.clientNumber,
          installationNumber: data.extracted.installationNumber,
          companyId: company.id,
        },
      });

      return tx.energyInvoice.create({
        data: {
          referenceMonth: data.extracted.referenceMonth,
          dueDate: new Date(data.extracted.dueDate),
          issueDate: new Date(data.extracted.issueDate),

          consumptionElectricalEnergyKwh:
            data.extracted.consumptionElectricalEnergyKwh,
          consumptionEnergySCEEKwh:
            data.invoiceCalculatedValues.consumptionEnergySCEEKwh,
          consumptionEnergyGDKwh: data.extracted.consumptionEnergyGDKwh,
          consumptionTotalKwh:
            data.invoiceCalculatedValues.consumptionElectricalEnergyKwhTotal,

          energyAmount: data.invoiceCalculatedValues.energyAmount,
          energyGDAmount: data.invoiceCalculatedValues.energyGDAmount,
          publicLightingContributionAmount:
            data.extracted.publicLightingContributionAmount,
          totalAmount: data.extracted.totalAmount,

          electricalEnergyUnitPrice: data.extracted.electricalEnergyUnitPrice,
          electricalEnergyUnitTaxe: data.extracted.electricalEnergyUnitTaxe,
          electricalEnergyAmount: data.extracted.electricalEnergyAmount,

          energySCEEUnitPrice: data.extracted.energySCEEUnitPrice,
          energySCEEUnitTaxe: data.extracted.energySCEEUnitTaxe,
          energySCEEAmount: data.extracted.energySCEEAmount,

          energyGDUnitPrice: data.extracted.energyGDUnitPrice,
          energyGDUnitTaxe: data.extracted.energyGDUnitTaxe,

          rawJson: data.extracted,

          clientId: client.id,
        },
      });
    });
  }
}
