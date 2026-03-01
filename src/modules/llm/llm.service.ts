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

      const pdfData = await pdf(pdfBuffer);

      const pdfText = (pdfData as PdfData).text;

      if (!pdfText || pdfText.trim().length === 0) {
        throw new Error('Não foi possível extrair texto do PDF');
      }
      const response = await this.openai.chat.completions.create({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Você é um especialista em extração de dados de faturas de energia elétrica brasileiras.',
          },
          {
            role: 'user',
            content: `Extraia os seguintes dados da fatura abaixo.

            Regras importantes:
            - Retorne APENAS JSON válido.
            - Não inclua explicações.
            - Para CNPJ e CPF, remova qualquer caractere não numérico (., -, /, espaços), mantendo apenas dígitos.
            - Valores monetários devem ser retornados como number.
            - Remova "R$", espaços e formatação.
            - Converta vírgula para ponto decimal.
            - Se um campo não estiver presente, ilegível ou não puder ser determinado com confiança:
              - Retorne null para campos string.
              - Retorne 0 para campos number.
            - Datas devem ser retornadas no formato ISO 8601 (YYYY-MM-DD).
              - Não inclua horário.
              - Converta datas no formato brasileiro (DD/MM/YYYY) para YYYY-MM-DD.
            - Sempre normalize "referenceMonth" para o formato ISO parcial YYYY-MM.
              - O mês deve conter dois dígitos.
              - Ignore qualquer outro formato textual.
            - "unitPrice": corresponde ao valor identificado como "Preço Unitário", normalmente apresentado em R$/kWh.
            - "unitTaxe": corresponde ao valor identificado como "Tarifa Unitária", também em R$/kWh, podendo aparecer apenas como "Tarifa".
            - Caso existam ambos no documento, extraia separadamente.
            - Caso apenas um exista, preencha o correspondente e retorne 0 para o outro.
            - O campo "publicLightingContributionAmount" corresponde ao valor identificado no PDF como:
            "Contrib Ilum Publica Municipal" ou "Contribuição Iluminação Pública Municipal".

            Formato esperado:
            {
              "companyName": string,
              "companyCnpj": string,
              "clientNumber": string,
              "clientName": string,
              "installationNumber": string,
              "referenceMonth": string,
              "dueDate": string,
              "issueDate": string"
              "consumptionElectricalEnergyKwh": number,
              "electricalEnergyUnitPrice": number,
              "electricalEnergyUnitTaxe": number,
              "electricalEnergyAmount": number,
              "consumptionEnergySCEEKwh": number,
              "energySCEEUnitPrice": number,
              "energySCEEUnitTaxe": number,
              "energySCEEAmount": number,
              "compensatedEnergyGDKwh": number,
              "compensatedEnergyGDUnitPrice": number
              "compensatedEnergyGDUnitTaxe": number
              "compensatedEnergyGDAmount": number,
              "publicLightingContributionAmount": number
              "totalAmount": number,
            }

            FATURA:
          ${pdfText}`,
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
