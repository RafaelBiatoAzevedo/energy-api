import { ApiProperty } from '@nestjs/swagger';

export class UploadInvoiceDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo da fatura (PDF)',
  })
  file: any;
}
