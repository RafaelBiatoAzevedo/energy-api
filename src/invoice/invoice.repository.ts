import { Injectable } from '@nestjs/common';
import { ExtractedInvoice } from 'src/modules/llm/llm.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoiceCalculatedValues } from './interfaces/invoiceCalculatedValues';
import { ListInvoicesQueryDto } from './dto/list-invoice-query.dto';
import { Prisma } from '@prisma/client';

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
          consumptionEnergySCEEKwh: data.extracted.consumptionEnergySCEEKwh,
          consumptionTotalKwh: data.invoiceCalculatedValues.consumptionTotalKwh,
          compensatedEnergyGDKwh:
            data.invoiceCalculatedValues.compensatedEnergyGDKwh,

          electricalEnergyUnitPrice: data.extracted.electricalEnergyUnitPrice,
          electricalEnergyUnitTaxe: data.extracted.electricalEnergyUnitTaxe,
          electricalEnergyAmount: data.extracted.electricalEnergyAmount,

          energySCEEUnitPrice: data.extracted.energySCEEUnitPrice,
          energySCEEUnitTaxe: data.extracted.energySCEEUnitTaxe,
          energySCEEAmount: data.extracted.energySCEEAmount,

          compensatedEnergyGDUnitPrice:
            data.extracted.compensatedEnergyGDUnitPrice,
          compensatedEnergyGDUnitTaxe:
            data.extracted.compensatedEnergyGDUnitTaxe,
          compensatedEnergyGDAmount:
            data.invoiceCalculatedValues.compensatedEnergyGDAmount,

          publicLightingContributionAmount:
            data.extracted.publicLightingContributionAmount,
          energyAmount: data.invoiceCalculatedValues.energyAmount,
          totalAmount: data.extracted.totalAmount,

          rawJson: data.extracted,

          clientId: client.id,
        },
      });
    });
  }

  async listInvoices(query: ListInvoicesQueryDto) {
    const {
      clientNumber,
      startMonth,
      endMonth,
      page = 1,
      pageSize = 10,
    } = query;

    const where: Prisma.EnergyInvoiceWhereInput = {};

    if (clientNumber) {
      where.client = {
        clientNumber,
      };
    }

    if (startMonth || endMonth) {
      where.referenceMonth = {};

      if (startMonth) {
        where.referenceMonth.gte = startMonth;
      }

      if (endMonth) {
        where.referenceMonth.lte = endMonth;
      }
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.energyInvoice.findMany({
        where,
        include: {
          client: {
            include: {
              company: true,
            },
          },
        },
        orderBy: {
          referenceMonth: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.energyInvoice.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
