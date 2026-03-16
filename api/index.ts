import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let app;

async function bootstrap() {
  const expressApp = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const config = new DocumentBuilder()
    .setTitle('Energy API')
    .setDescription('API for managing energy bills')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('docs', nestApp, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // eslint-disable-next-line @typescript-eslint/await-thenable
  await nestApp.enableCors();

  await nestApp.init();

  return expressApp;
}

export default async function handler(req, res) {
  if (!app) {
    app = await bootstrap();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return app(req, res);
}
