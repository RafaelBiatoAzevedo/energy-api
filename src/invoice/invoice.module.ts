import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { LlmModule } from 'src/modules/llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
