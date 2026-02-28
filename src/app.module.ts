import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LlmModule } from './modules/llm/llm.module';
import { InvoiceModule } from './invoice/invoice.module';
import { envValidationSchema } from './shared/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    LlmModule,
    InvoiceModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
