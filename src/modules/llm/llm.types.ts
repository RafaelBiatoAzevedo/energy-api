import { z } from 'zod';

export const ExtractedInvoiceSchema = z.object({
  companyName: z.string(),
  companyCnpj: z.string(),
  installationNumber: z.string(),
  clientNumber: z.string(),
  referenceMonth: z.string(),

  clientName: z.string(),
  dueDate: z.string(),
  issueDate: z.string(),

  consumptionElectricalEnergyKwh: z.number(),
  electricalEnergyUnitPrice: z.number(),
  electricalEnergyUnitTaxe: z.number(),
  electricalEnergyAmount: z.number(),

  consumptionEnergySCEEKwh: z.number(),
  energySCEEUnitPrice: z.number(),
  energySCEEUnitTaxe: z.number(),
  energySCEEAmount: z.number(),

  compensatedEnergyGDKwh: z.number(),
  compensatedEnergyGDUnitPrice: z.number(),
  compensatedEnergyGDUnitTaxe: z.number(),
  compensatedEnergyGDAmount: z.number(),

  publicLightingContributionAmount: z.number(),

  totalAmount: z.number(),
});

export type ExtractedInvoice = z.infer<typeof ExtractedInvoiceSchema>;
