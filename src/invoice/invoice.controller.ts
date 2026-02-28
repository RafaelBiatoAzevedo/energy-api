import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';

import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload e processamento de fatura em PDF' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const { buffer } = file as { buffer: Buffer };

    if (!buffer) {
      throw new BadRequestException('Arquivo inválido');
    }

    return this.invoiceService.processInvoice(buffer);
  }
}
