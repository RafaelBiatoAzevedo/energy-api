import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';

let server: any;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await app.init();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return serverlessExpress({ app: expressApp });
}

export default async function handler(req: any, res: any) {
  if (!server) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    server = await bootstrap();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return server(req, res);
}
