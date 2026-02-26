import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ExtractedInvoice } from './llm.types';

@Injectable()
export class LlmService {
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY não definida');
    }

    this.anthropic = new Anthropic({
      apiKey,
    });
  }

  async extractInvoiceFromPdf(pdfBase64: string) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: `
                      Extraia os seguintes dados da fatura de energia elétrica.
                      Retorne APENAS JSON válido neste formato:

                      {
                        "installationNumber": string,
                        "utilityCompany": string,
                        "referenceMonth": string,
                        "consumptionKwh": number,
                        "totalAmount": number,
                        "taxes": number
                      }
                `,
              },
            ],
          },
        ],
      });

      const content = response.content[0];

      if (content.type !== 'text') {
        throw new Error('Resposta inesperada do modelo');
      }

      const parsed = JSON.parse(content.text) as ExtractedInvoice;

      return parsed;
    } catch (error) {
      console.error('Erro ao processar PDF com Claude:', error);

      throw new InternalServerErrorException(
        'Erro ao processar PDF com Claude',
      );
    }
  }
}
