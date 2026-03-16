import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';

let cachedServer;

async function bootstrap() {
  const expressApp = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await nestApp.init();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return serverlessExpress({ app: expressApp });
}

export default async function handler(req, res) {
  if (!cachedServer) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cachedServer = await bootstrap();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return cachedServer(req, res);
}
