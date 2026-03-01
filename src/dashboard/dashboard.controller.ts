import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Returns consolidated metrics to the dashboard',
    description: [
      'Fornece dados agregados para visualização de gráficos e KPIs.',
      '',
      '**Métricas de Energia (kWh):**',
      '- **Consumo:** Soma da Energia Elétrica e Energia SCEE.',
      '- **Compensada:** Total de Energia Injetada/GD.',
      '',
      '**Métricas Financeiras (R$):**',
      '- **Total sem GD:** Valor que seria pago sem o benefício da compensação.',
      '- **Economia GD:** Valor real economizado através da compensação de créditos.',
      '',
      'Permite filtros opcionais por **clientNumber** e **referenceMonth**.',
    ].join('\n'),
  })
  @ApiQuery({
    name: 'clientNumber',
    required: false,
    description: 'Customer number to filter data (optional)',
  })
  @ApiQuery({
    name: 'referenceMonth',
    required: false,
    description: 'Ex: JAN/2024 ou 2024-01',
  })
  @ApiResponse({
    status: 200,
    description: 'Data returned successfully.',
    type: DashboardResponseDto,
  })
  async getDashboardData(
    @Query('clientNumber') clientNumber?: string,
    @Query('referenceMonth') referenceMonth?: string,
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getMetrics(clientNumber, referenceMonth);
  }
}
