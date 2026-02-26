import { z } from 'zod';

export const ExtractedInvoiceSchema = z.object({
  installationNumber: z.string(),
  utilityCompany: z.string(),
  referenceMonth: z.string(),
  consumptionKwh: z.number(),
  totalAmount: z.number(),
  taxes: z.number(),
});

export type ExtractedInvoice = z.infer<typeof ExtractedInvoiceSchema>;
