import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { LlmModule } from '../modules/llm/llm.module';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoiceRepository } from './invoice.repository';

@Module({
  imports: [LlmModule, PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
