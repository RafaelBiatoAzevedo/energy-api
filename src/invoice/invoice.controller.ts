import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';

import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UploadInvoiceDto } from './dto/upload-invoice.dto';
import { ListInvoicesQueryDto } from './dto/list-invoice-query.dto';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload and process energy invoice PDF',
    description:
      'Receives a PDF file, extracts data using LLM, validates, calculates derived values and persists the invoice.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadInvoiceDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.includes('pdf')) {
          return callback(new BadRequestException('Only PDF allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not sent');
    }

    const { buffer } = file as { buffer: Buffer };

    if (!buffer) {
      throw new BadRequestException('Invalid file');
    }

    return this.invoiceService.processInvoice(buffer);
  }

  @Get()
  @ApiOperation({
    summary: 'List invoices with filters',
    description: `
      Returns a paginated list of processed energy invoices.

      Allows optional filtering by:
      - Client number
      - Reference month range (startMonth and endMonth)

      Results are ordered by referenceMonth in descending order.
      Includes client and company information in the response.
    `,
  })
  async list(@Query() query: ListInvoicesQueryDto) {
    return this.invoiceService.listInvoices(query);
  }
}
