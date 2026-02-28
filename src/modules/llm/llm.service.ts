import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import { ExtractedInvoice } from './llm.types';

//type PdfParseType = (buffer: Buffer) => Promise<{ text: string }>;

interface PdfData {
  text: string;
  numpages: number;
  info: any;
  metadata: any;
  version: string;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY não definida');
    }

    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  async extractInvoiceFromPdf(pdfBase64: string): Promise<ExtractedInvoice> {
    try {
      const pdfBuffer = Buffer.from(pdfBase64, 'base64');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const pdfData = await pdf(pdfBuffer);

      const pdfText = (pdfData as PdfData).text;

      if (!pdfText || pdfText.trim().length === 0) {
        throw new Error('Não foi possível extrair texto do PDF');
      }
      const response = await this.openai.chat.completions.create({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `
Extraia os seguintes dados da fatura abaixo.
Retorne APENAS JSON válido neste formato:

{
  "installationNumber": string,
  "utilityCompany": string,
  "referenceMonth": string,
  "consumptionKwh": number,
  "totalAmount": number,
  "taxes": number
}

FATURA:
${pdfText}
            `,
          },
        ],
        temperature: 0,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta vazia do modelo');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Modelo não retornou JSON válido');
      }

      const parsed = JSON.parse(jsonMatch[0]) as ExtractedInvoice;

      return parsed;
    } catch (error) {
      this.logger.error('Erro ao processar PDF', error as Error);

      throw new InternalServerErrorException(
        'Erro ao processar PDF com OpenRouter',
      );
    }
  }
}
