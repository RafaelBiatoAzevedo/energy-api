import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let app;

async function bootstrap() {
  const expressApp = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

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
