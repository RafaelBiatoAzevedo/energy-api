import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';

describe('DashboardService', () => {
  let service: DashboardService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: DashboardRepository;

  const mockInvoices = [
    {
      referenceMonth: '2024-06',
      consumptionElectricalEnergyKwh: 100,
      consumptionEnergySCEEKwh: 400,
      compensatedEnergyGDKwh: 400,
      electricalEnergyAmount: 100,
      energySCEEAmount: 200,
      compensatedEnergyGDAmount: 150,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: DashboardRepository,
          useValue: {
            getConsolidatedData: jest.fn().mockResolvedValue(mockInvoices),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    repository = module.get<DashboardRepository>(DashboardRepository);
  });

  it('deve calcular corretamente os valores de energia e financeiros', async () => {
    const result = await service.getMetrics();

    // Valida kWh: (100 + 400) = 500
    expect(result.resultsEnergyKwh[0].consumption).toBe(500);
    expect(result.resultsEnergyKwh[0].compensated).toBe(400);

    // Valida Financeiro: (100 + 200) = 300
    expect(result.resultsFinancialR$[0].consumptionTotalAmount).toBe(300);
    expect(result.resultsFinancialR$[0].economyGD).toBe(150); // Absoluto
  });
});
