import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { mockLLMResponse } from '../../test/mocks/llm-response.mock';
import { LlmService } from '../modules/llm/llm.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let llmService: jest.Mocked<LlmService>;
  let repository: jest.Mocked<InvoiceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: LlmService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            extractInvoiceFromPdf: jest.fn((_pdfBase64: string) =>
              Promise.resolve(mockLLMResponse),
            ),
          },
        },
        {
          provide: InvoiceRepository,
          useValue: {
            saveInvoice: jest.fn().mockResolvedValue({ id: 'uuid-gerado-123' }),
            listInvoices: jest.fn().mockResolvedValue({ data: [], meta: {} }),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    llmService = module.get(LlmService);
    repository = module.get(InvoiceRepository);
  });

  it('deve processar uma fatura com sucesso chamando o LLM corretamente', async () => {
    const mockBuffer = Buffer.from('pdf-fake-content');

    const result = await service.processInvoice(mockBuffer);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(llmService.extractInvoiceFromPdf).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.saveInvoice).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'uuid-gerado-123');
  });

  it('deve falhar se o LLM retornar erro interno', async () => {
    llmService.extractInvoiceFromPdf.mockRejectedValue(
      new Error('Falha no DeepSeek'),
    );

    await expect(
      service.processInvoice(Buffer.from('bad-pdf')),
    ).rejects.toThrow();
  });
});
