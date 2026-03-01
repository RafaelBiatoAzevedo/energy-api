import { ApiProperty } from '@nestjs/swagger';

class CompanyDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() cnpj: string;
}

class ClientDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() clientNumber: string;
  @ApiProperty() installationNumber: string;
  @ApiProperty({ type: CompanyDto }) company: CompanyDto;
}

class InvoiceItemDto {
  @ApiProperty() id: string;
  @ApiProperty() referenceMonth: string;
  @ApiProperty() consumptionTotalKwh: number;
  @ApiProperty() totalAmount: string;
  @ApiProperty({ type: ClientDto }) client: ClientDto;
}

class MetaDto {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() pageSize: number;
  @ApiProperty() totalPages: number;
}

export class InvoicesResponseDto {
  @ApiProperty({ type: [InvoiceItemDto] })
  data: InvoiceItemDto[];

  @ApiProperty()
  meta: MetaDto;
}
