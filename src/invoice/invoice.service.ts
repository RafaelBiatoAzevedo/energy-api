import { Injectable } from '@nestjs/common';
import { LlmService } from '../modules/llm/llm.service';
//import { ExtractedInvoiceSchema } from '../modules/llm/llm.schema';
import { ExtractedInvoice } from '../modules/llm/llm.types';

@Injectable()
export class InvoiceService {
  constructor(private readonly llmService: LlmService) {}

  async processInvoice(buffer: Buffer) {
    const pdfBase64 = buffer.toString('base64');

    const rawResponse = await this.llmService.extractInvoiceFromPdf(pdfBase64);

    // // 3️⃣ Validar com Zod
    // const parsed = ExtractedInvoiceSchema.safeParse(rawResponse);

    // if (!parsed.success) {
    //   throw new BadRequestException({
    //     message: 'Invalid invoice data returned by LLM',
    //     errors: parsed.error.flatten(),
    //   });
    // }

    const extracted: ExtractedInvoice = rawResponse;

    // const calculatedTotal = extracted.consumptionKwh * 0.95;
    // const difference = extracted.totalAmount - calculatedTotal;

    return {
      ...extracted,
    };
  }
}
