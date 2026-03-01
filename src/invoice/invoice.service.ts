import { BadRequestException, Injectable } from '@nestjs/common';
import { LlmService } from '../modules/llm/llm.service';
import { ExtractedInvoiceSchema } from '../modules/llm/llm.types';
import { ExtractedInvoice } from '../modules/llm/llm.types';
import { InvoiceCalculatedValues } from './interfaces/invoiceCalculatedValues';
import { InvoiceRepository } from './invoice.repository';
import { ListInvoicesQueryDto } from './dto/list-invoice-query.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly llmService: LlmService,
    private repository: InvoiceRepository,
  ) {}

  async processInvoice(buffer: Buffer) {
    const pdfBase64 = buffer.toString('base64');

    const rawJson = await this.llmService.extractInvoiceFromPdf(pdfBase64);

    const parsed = ExtractedInvoiceSchema.safeParse(rawJson);

    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid invoice data returned by LLM',
        errors: parsed.error.flatten(),
      });
    }

    const invoiceCalculated = this.InvoiceCalculationService(rawJson);

    return this.repository.saveInvoice({
      extracted: rawJson,
      invoiceCalculatedValues: invoiceCalculated,
    });
  }

  private InvoiceCalculationService(
    data: ExtractedInvoice,
  ): InvoiceCalculatedValues {
    const consumptionElectricalEnergyKwhTotal =
      (data.consumptionElectricalEnergyKwh ?? 0) +
      (data.consumptionEnergySCEEKwh ?? 0);

    const consumptionEnergySCEEKwh = data.consumptionEnergySCEEKwh ?? 0;

    const energyAmount =
      (data.electricalEnergyAmount ?? 0) +
      (data.energySCEEAmount ?? 0) +
      (data.publicLightingContributionAmount ?? 0);

    const energyGDAmount = Math.abs(data.energyGDAmount ?? 0);

    return {
      consumptionElectricalEnergyKwhTotal,
      consumptionEnergySCEEKwh,
      energyAmount,
      energyGDAmount,
    };
  }

  async listInvoices(query: ListInvoicesQueryDto) {
    return this.repository.listInvoices(query);
  }
}
