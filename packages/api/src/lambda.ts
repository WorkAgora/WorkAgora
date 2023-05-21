import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('WorkAgora API')
    .setDescription('WorkAgora API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
      logger: ['error', 'warn', 'log']
    });
    nestApp.use(eventContext());
    nestApp.use(cookieParser());
    nestApp.enableCors({
      origin: `${process.env.FRONT_PROTOCOL}${process.env.FRONT_URL}`,
      credentials: true
    });
    nestApp.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        skipMissingProperties: false
      })
    );
    setupSwagger(nestApp);
    await nestApp.init();

    Logger.log(`🚀 API app is running on port 3000`);
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  if (event.path === '/swagger') {
    event.path = '/swagger/';
  }
  event.path = event.path.includes('swagger-ui') ? `/swagger${event.path}` : event.path;

  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
