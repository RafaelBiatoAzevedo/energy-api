import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { LlmModule } from 'src/modules/llm/llm.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [LlmModule, PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
