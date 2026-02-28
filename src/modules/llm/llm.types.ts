import { z } from 'zod';

export const ExtractedInvoiceSchema = z.object({
  companyName: z.string(),
  companyCnpj: z.string(),
  installationNumber: z.string(),
  clientNumber: z.string(),
  referenceMonth: z.string(),
  consumptionElectricalEnergyKwh: z.number(),
  electricalEnergyAmount: z.number(),
  publicLightingContributionAmount: z.number(),
  totalAmount: z.number(),
  clientName: z.string(),
  dueDate: z.string(),
  issueDate: z.string(),
  consumptionEnergySCEEKwh: z.number(),
  energySCEEAmount: z.number(),
  consumptionEnergyGDKwh: z.number(),
  energyGDAmount: z.number(),
  electricalEnergyUnitPrice: z.number(),
  electricalEnergyUnitTaxe: z.number(),
  energySCEEUnitPrice: z.number(),
  energySCEEUnitTaxe: z.number(),
  energyGDUnitPrice: z.number(),
  energyGDUnitTaxe: z.number(),
});

export type ExtractedInvoice = z.infer<typeof ExtractedInvoiceSchema>;
