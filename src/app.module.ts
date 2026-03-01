import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LlmModule } from './modules/llm/llm.module';
import { InvoiceModule } from './invoice/invoice.module';
import { envValidationSchema } from './shared/config/env.validation';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    LlmModule,
    InvoiceModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
